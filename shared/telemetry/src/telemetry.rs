use opentelemetry::{global, trace::TracerProvider};
use opentelemetry_otlp::{LogExporter, MetricExporter, Protocol, SpanExporter, WithExportConfig};
use opentelemetry_sdk::{logs::{SdkLogger, SdkLoggerProvider}, metrics::SdkMeterProvider, propagation::TraceContextPropagator, trace::{Sampler, SdkTracerProvider, Tracer}, Resource};
use tracing_opentelemetry::OpenTelemetryLayer;
use tracing_subscriber::{fmt::Layer as term_Layer, layer::SubscriberExt, registry, util::SubscriberInitExt, EnvFilter, Layer, Registry};
use opentelemetry_appender_tracing::layer::OpenTelemetryTracingBridge;

use crate::tracing_propegation::TraceContextInjector;


pub fn init_telemetry(name: &str){

    registry()
        .with(init_tracer(name))
        .with(init_logger(name).with_filter(get_filter()))
        .with(term_Layer::default().pretty().with_file(true).with_filter(get_filter()))
        .init();
}

fn init_logger(name: &str) -> OpenTelemetryTracingBridge<SdkLoggerProvider, SdkLogger>{

    let exporter = LogExporter::builder()
        .with_http()
        .with_protocol(Protocol::HttpBinary)
        .build().expect("failted to create exporter");

    let provider = SdkLoggerProvider::builder()
        .with_log_processor(TraceContextInjector::new(exporter, get_recourse(name)))
        .with_resource(get_recourse(name))
        .build();

    OpenTelemetryTracingBridge::new(&provider)
}

fn init_tracer(name: &str) -> OpenTelemetryLayer<Registry, Tracer>{

    let exporter = SpanExporter::builder()
        .with_http()
        .with_protocol(Protocol::HttpBinary)
        .build().expect("failted to create exporter");

    opentelemetry::global::set_text_map_propagator(TraceContextPropagator::new());

    let provider = SdkTracerProvider::builder()
        .with_batch_exporter(exporter)
        .with_resource(get_recourse(name))
        .with_sampler(Sampler::AlwaysOn)
        .build();

    let tracer = provider.tracer("tracer");

    global::set_tracer_provider(provider);

    OpenTelemetryLayer::new(tracer)
}

pub fn init_metrics(name: &str) {

    let exporter = MetricExporter::builder()
        .with_http()
        .with_protocol(Protocol::HttpBinary)
        .build().expect("failed to creat exporter");

    let provider = SdkMeterProvider::builder()
        .with_periodic_exporter(exporter)
        .with_resource(get_recourse(name))
        .build();

    global::set_meter_provider(provider.clone());
}

fn get_filter() -> EnvFilter {
    EnvFilter::new("trace")
        .add_directive("hyper=off".parse().unwrap())
        .add_directive("tonic=off".parse().unwrap())
        .add_directive("h2=off".parse().unwrap())
        .add_directive("opentelemetry=off".parse().unwrap())
        .add_directive("reqwest=off".parse().unwrap())

}

fn get_recourse(name: &str) -> Resource{
    Resource::builder().with_service_name(name.to_string()).build()

}

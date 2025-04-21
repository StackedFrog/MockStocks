use opentelemetry::trace::TracerProvider;
use opentelemetry_otlp::{LogExporter, Protocol, SpanExporter, WithExportConfig};
use opentelemetry_sdk::{logs::{SdkLogger, SdkLoggerProvider}, trace::{Sampler, SdkTracerProvider, Tracer}, Resource};
use tracing_opentelemetry::OpenTelemetryLayer;
use tracing_subscriber::{fmt::Layer as term_Layer, layer::SubscriberExt, registry, util::SubscriberInitExt, EnvFilter, Layer, Registry};
use opentelemetry_appender_tracing::layer::OpenTelemetryTracingBridge;

pub fn init_telemetry(){
    registry()
        .with(init_tracer())
        .with(init_logger().with_filter(get_filter()))
        .with(term_Layer::default().with_filter(get_filter()))
        .init();
}

pub fn init_dev_telemetry(){
    registry()
        .with(term_Layer::default().with_filter(get_filter()))
        .init();
}

fn init_logger() -> OpenTelemetryTracingBridge<SdkLoggerProvider, SdkLogger>{

    let exporter = LogExporter::builder()
        .with_http()
        .with_protocol(Protocol::HttpBinary)
        .build().expect("failted to create exporter");

    let provider = SdkLoggerProvider::builder()
        .with_batch_exporter(exporter)
        .with_resource(get_recourse())
        .build();

    OpenTelemetryTracingBridge::new(&provider)
}

fn init_tracer() -> OpenTelemetryLayer<Registry, Tracer>{

    let exporter = SpanExporter::builder()
        .with_http()
        .with_protocol(Protocol::HttpBinary)
        .build().expect("failted to create exporter");

    let provider = SdkTracerProvider::builder()
        .with_batch_exporter(exporter)
        .with_resource(get_recourse())
        .with_sampler(Sampler::AlwaysOn)
        .build();

    let tracer = provider.tracer("tracer");

    OpenTelemetryLayer::new(tracer)
}

fn init_metrics(){
    todo!("creat metrics provider")
}

fn get_filter() -> EnvFilter {
    EnvFilter::new("trace")
        .add_directive("hyper=off".parse().unwrap())
        .add_directive("tonic=off".parse().unwrap())
        .add_directive("h2=off".parse().unwrap())
        .add_directive("opentelemetry=off".parse().unwrap())
        .add_directive("reqwest=off".parse().unwrap())
}


fn get_recourse() -> Resource{
    Resource::builder().with_service_name("Stock app").build()

}

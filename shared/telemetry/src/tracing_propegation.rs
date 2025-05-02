use std::sync::Arc;
use axum::{extract::Request, http::HeaderMap};
use opentelemetry::{global, trace::TraceContextExt, logs::LogRecord};
use opentelemetry_http::{HeaderExtractor, HeaderInjector};
use opentelemetry_sdk::{logs::{BatchLogProcessor, LogExporter, LogProcessor, SdkLogRecord}, Resource};
use tracing::{Level, Span};
use tracing_opentelemetry::OpenTelemetrySpanExt;

#[derive(Debug)]
pub struct TraceContextInjector{
    inner: Arc<dyn LogProcessor + Send + Sync>
}

impl TraceContextInjector {
    pub fn new(exporter: impl LogExporter + Send + Sync + 'static, resource: Resource) -> Self {

        let mut processor = BatchLogProcessor::builder(exporter).build();
        processor.set_resource(&resource);
        Self {
            inner: Arc::new(processor)
        }
    }
}

impl LogProcessor for TraceContextInjector{

    fn emit(&self, data: &mut SdkLogRecord, _instrumentation: &opentelemetry::InstrumentationScope) {
        let ctx = Span::current().context();
        let span = ctx.span();
        let span_ctx = span.span_context();
        data.set_trace_context(span_ctx.trace_id(), span_ctx.span_id(), Some(span_ctx.trace_flags()));
        self.inner.emit(data, _instrumentation);
    }

    fn shutdown(&self) -> opentelemetry_sdk::error::OTelSdkResult {
        self.inner.shutdown()
    }

    fn force_flush(&self) -> opentelemetry_sdk::error::OTelSdkResult {
        self.inner.force_flush()
    }
}

pub fn propagate_tracing(request: &Request<>) -> Span{
    let parent_cx = global::get_text_map_propagator(|propagator| {
        propagator.extract(&HeaderExtractor(request.headers()))
    });
    let span = tracing::span!(
        Level::INFO,
        "request",
        method = %request.method(),
        uri = %request.uri(),
    );
    span.set_parent(parent_cx);
    span
}

pub fn inject_tracing_context() -> HeaderMap {

    let mut headers = HeaderMap::new();
    global::get_text_map_propagator(|propagator| {
        propagator.inject_context(
            &Span::current().context(),
            &mut HeaderInjector(&mut headers));
    });
    headers
}

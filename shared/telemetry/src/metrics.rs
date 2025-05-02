use std::{sync::Arc, time::Instant};
use axum::{extract::Request, middleware::Next, response::Response};
use opentelemetry::{global, metrics::{Counter, Histogram}, KeyValue};

#[derive(Clone)]
pub struct MetricsLayer {
    request_counter: Counter<u64>,
    request_duration: Histogram<f64>
}

impl MetricsLayer{
    pub fn new() -> Arc<Self>{

        let meter = global::meter("test_global");
        let request_counter = meter.u64_counter("test_123")
            .with_description("total_numbers_of_requests")
            .build();

        let request_duration = meter.f64_histogram("test_Histogram_123")
            .with_unit("s")
            .with_description("http quest duration")
            .with_boundaries(vec![0.0, 0.5, 1.0, 1.5, 2.0])
            .build();

        Arc::new(Self{
            request_counter,
            request_duration
        })
    }

    pub fn into_middleware(
        self: Arc<Self>,
    ) -> impl Clone + Send + Sync + 'static + Fn(Request<axum::body::Body>, Next) -> std::pin::Pin<Box<dyn std::future::Future<Output = Response> + Send>> {
        move |req, next| {
            let metrics = self.clone();
            Box::pin(async move {
                metrics.layer(req, next).await
            })
        }
    }

    pub async fn layer(
        self: Arc<Self>,
        req: Request,
        next: Next,
    ) -> Response {
        let method = req.method().clone().to_string();
        let path = req.uri().to_string();
        let start = Instant::now();

        let response = next.run(req).await;

        let status = response.status().as_u16().to_string();
        let duration = start.elapsed().as_secs_f64();

        let lable = &[
            KeyValue::new("method", method),
            KeyValue::new("status", status),
            KeyValue::new("path", path),
        ];
        self.request_counter.add(1, lable);
        self.request_duration.record(duration, lable);

        response
    }
}

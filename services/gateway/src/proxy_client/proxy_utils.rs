use axum::{body::Body, extract::Request, http::response::Builder, response::Response};
use http_body_util::BodyExt;
use hyper::HeaderMap;
use reqwest::{Client, RequestBuilder};
use telemetry::tracing_propegation;

use crate::token::token::Claims;

use super::{Error, Result};

pub struct ServiceRequestBuilder {
    request: Request<Body>,
    request_builder: RequestBuilder,
}

impl ServiceRequestBuilder {
    pub fn new(req: Request<Body>, destination: String, client: &Client) -> Self {
        Self {
            request_builder: client.request(req.method().clone(), destination),
            request: req,
        }
    }

    pub async fn with_body(mut self) -> Self {
        if let Some(body) = self.request.body_mut().collect().await.ok() {
            self.request_builder = self.request_builder.body(body.to_bytes())
        }
        self
    }

    pub fn with_content_type(mut self) -> Self {
        if let Some(content_type) = self.request.headers().get("content-type") {
            self.request_builder = self.request_builder.header("content-type", content_type);
        }
        self
    }

    pub fn with_cookie(mut self) -> Self {
        if let Some(cookie) = self.request.headers().get("cookie") {
            self.request_builder = self.request_builder.header("cookie", cookie);
        }
        self
    }

    pub fn with_user_id(mut self) -> Self {
        if let Some(ctx) = self.request.extensions().get::<Claims>() {
            self.request_builder = self
                .request_builder
                .header("x-user-id", ctx.sub.to_string().clone());
        }
        self
    }

    pub fn with_tracing_context(mut self) -> Self {
        let headers = tracing_propegation::inject_tracing_context();
        self.request_builder = self.request_builder.headers(headers);
        self
    }

    pub fn build(self) -> RequestBuilder {
        self.request_builder
    }
}

pub struct ServiceResponseBuilder {
    response: reqwest::Response,
    builder: Builder,
}

impl ServiceResponseBuilder {
    pub fn new(service_response: reqwest::Response) -> Self {
        Self {
            response: service_response,
            builder: Response::builder(),
        }
    }

    pub fn with_content_type(mut self) -> Self {
        if let Some(content_type) = self.response.headers().get("content-type") {
            self.builder = self.builder.header("content-type", content_type);
        }
        self
    }

    pub fn with_cookie(mut self) -> Self {
        if let Some(cookie) = self.response.headers().get("set-cookie") {
            self.builder = self.builder.header("set-cookie", cookie.clone());
        }
        self
    }

    pub fn with_dash_cookie(mut self, headers: &HeaderMap) -> Self {
        if let Some(cookie) = headers.get("set-cookie") {
            self.builder = self.builder.header("set-cookie", cookie.clone());
        }
        self
    }

    pub fn with_status(mut self) -> Self {
        self.builder = self.builder.status(self.response.status());
        self
    }

    pub fn with_location(mut self) -> Self {
        if let Some(location) = self.response.headers().get("location") {
            self.builder = self.builder.header("location", location);
        }
        self
    }

    pub async fn build(self) -> Result<Response<Body>> {
        let body_bytes = self
            .response
            .bytes()
            .await
            .map_err(|_| Error::CanNotParesResponseBody)?;

        self.builder
            .body(Body::from(body_bytes))
            .map_err(|_| Error::CanNotParesResponseBody)
    }
}

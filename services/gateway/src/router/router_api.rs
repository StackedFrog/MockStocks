use crate::{
    AppState,
<<<<<<< HEAD
    utils::{
        dns::DNS,
        proxy_utils::{ServiceRequestBuilder, ServiceResponseBuilder},
    },
=======
    proxy_client::proxy_utils::{ServiceRequestBuilder, ServiceResponseBuilder},
    utils::{dns::DNS, url_format::target_url},
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
};
use axum::{
    Router,
    body::Body,
    extract::{Path, Request, State},
    response::Response,
    routing::any,
};

use super::{Error, Result};

pub fn routes(state: AppState) -> Router {
    Router::new()
        .route("/api/{:service}/{*path}", any(api_proxy))
        .with_state(state)
}

async fn api_proxy(
    state: State<AppState>,
    Path((service, path)): Path<(String, String)>,
    req: Request<Body>,
) -> Result<Response> {
    let client = state.http_client.clone();

<<<<<<< HEAD
    // replace wirh parser
    // let auth_url = "http://localhost:4002";

=======
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
    let service_url = service
        .to_domain()
        .map_err(|_| Error::ServiceDoesNotExist)?;

    let target_url = target_url(service_url, path, req.uri());

    let service_request = ServiceRequestBuilder::new(req, target_url, &client)
        .with_content_type()
        .with_user_id()
<<<<<<< HEAD
=======
        .with_tracing_context()
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
        .with_body()
        .await
        .build();

    let service_res = service_request
        .send()
        .await
        .map_err(|_| Error::ServiceNotAvailable)?;

    let response = ServiceResponseBuilder::new(service_res)
        .with_status()
        .with_content_type()
        .build()
        .await
        .map_err(|_| Error::CanNotParseServiceResponse)?;

    Ok(response)
}

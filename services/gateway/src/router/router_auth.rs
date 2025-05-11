use crate::{
    AppState,
<<<<<<< HEAD
    utils::proxy_utils::{ServiceRequestBuilder, ServiceResponseBuilder},
=======
    proxy_client::proxy_utils::{ServiceRequestBuilder, ServiceResponseBuilder},
    utils::url_format::target_url,
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
};
use axum::{
    Router,
    body::Body,
    extract::{Path, Request, State},
<<<<<<< HEAD
    response::Response,
    routing::{any, get, post},
};
use tracing::instrument;
=======
    middleware::from_fn,
    response::Response,
    routing::any,
};
use reqwest::RequestBuilder;
use tracing::info;
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f

use super::{Error, Result, mw_auth};

pub fn routes(state: AppState) -> Router {
    let user_router = Router::new()
        .route("/auth/user/{*path}", any(auth_proxy_user))
        .layer(from_fn(mw_auth::mw_ctx_resolver));

    let admin_router = Router::new()
        .route("/auth/admin/{*path}", any(auth_proxy_admin))
        .layer(from_fn(mw_auth::mw_ctx_resolver_admin));

<<<<<<< HEAD
pub fn routes(state: AppState) -> Router {
=======
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
    Router::new()
        .merge(user_router)
        .merge(admin_router)
        .route("/auth/{*path}", any(auth_proxy))
        .with_state(state)
}

pub async fn auth_proxy_admin(
    state: State<AppState>,
    Path(path): Path<String>,
    req: Request<Body>,
) -> Result<Response> {
    let client = state.http_client.clone();

    let auth_url = "http://auth:4002/admin/";

    let target_url = target_url(auth_url, path, req.uri());

    let service_request = ServiceRequestBuilder::new(req, target_url, &client)
        .with_content_type()
        .with_cookie()
        .with_tracing_context()
        .with_user_id()
        .with_body()
        .await
        .build();

    let response = call_proxy(service_request).await?;

    Ok(response)
}

pub async fn auth_proxy_user(
    state: State<AppState>,
    Path(path): Path<String>,
    req: Request<Body>,
) -> Result<Response> {
    let client = state.http_client.clone();

    let auth_url = "http://auth:4002/user/";

    let target_url = target_url(auth_url, path, req.uri());

    let service_request = ServiceRequestBuilder::new(req, target_url, &client)
        .with_content_type()
        .with_cookie()
        .with_tracing_context()
        .with_user_id()
        .with_body()
        .await
        .build();

    let response = call_proxy(service_request).await?;

    Ok(response)
}

pub async fn auth_proxy(
    state: State<AppState>,
    Path(path): Path<String>,
    req: Request<Body>,
) -> Result<Response> {
    let client = state.http_client.clone();

    let auth_url = "http://auth:4002/";

    let target_url = target_url(auth_url, path, req.uri());

    let service_request = ServiceRequestBuilder::new(req, target_url, &client)
        .with_content_type()
        .with_cookie()
        .with_tracing_context()
        .with_body()
        .await
        .build();

<<<<<<< HEAD
=======
    info!("{:?}", service_request);

    let response = call_proxy(service_request).await?;

    Ok(response)
}

async fn call_proxy(service_request: RequestBuilder) -> Result<Response> {
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
    let service_res = service_request
        .send()
        .await
        .map_err(|_| Error::ServiceNotAvailable)?;

    let response = ServiceResponseBuilder::new(service_res)
        .with_content_type()
        .with_status()
        .with_cookie()
        .build()
        .await
        .map_err(|_| Error::CanNotParseServiceResponse)?;

    Ok(response)
}

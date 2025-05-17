use crate::{
    AppState,
    proxy_client::proxy_utils::{ServiceRequestBuilder, ServiceResponseBuilder},
    token::token::validate_dash_token,
    utils::url_format::target_url,
};
use axum::{
    Router,
    body::Body,
    extract::{Path, Request, State},
    response::Response,
    routing::any,
};
use tower_cookies::{CookieManagerLayer, Cookies};

use super::{Error, Result};

pub fn routes(state: AppState) -> Router {
    Router::new()
        .route("/auth/grafana/{*path}", any(auth_proxy_grafana))
        .layer(CookieManagerLayer::new())
        .with_state(state)
}

pub async fn auth_proxy_grafana(
    state: State<AppState>,
    cookies: Cookies,
    Path(path): Path<String>,
    req: Request<Body>,
) -> Result<Response> {
    validate_cookie(cookies)?;

    let client = state.http_client.clone();

    let service_url = "http://lgtm:3000/auth/grafana/";

    let url = target_url(service_url, path, req.uri());

    let res = ServiceRequestBuilder::new(req, url, &client)
        .with_content_type()
        .with_body()
        .await
        .build();

    let t = res.send().await.map_err(|_| Error::ServiceNotAvailable)?;

    let response = ServiceResponseBuilder::new(t)
        .with_content_type()
        .with_status()
        .build()
        .await
        .map_err(|_| Error::CanNotParseServiceResponse)?;

    Ok(response)
}

fn validate_cookie(cookies: Cookies) -> Result<()> {
    let grafana_token = cookies.get("grafanaToken").ok_or(Error::TokenMissing)?;
    validate_dash_token(grafana_token.value())?;
    Ok(())
}

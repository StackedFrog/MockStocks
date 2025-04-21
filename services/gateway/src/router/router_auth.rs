use axum::{body::Body, extract::{Path, Request, State}, response::Response, routing::{any, get, post}, Router};
use crate::{utils::proxy_utils::{ServiceRequestBuilder, ServiceResponseBuilder}, AppState};

use super::{Error, Result};




pub fn routes(state: AppState) -> Router{
    Router::new()
        .route("/auth/{*path}", post(auth_proxy))
        .with_state(state)
}

pub async fn auth_proxy(
    state: State<AppState>,
    Path(path) : Path<String>,
    req : Request<Body>
) -> Result<Response>{
    println!("in prox");
    let client = state.http_client.clone();

    // replace wirh parser

    let auth_url = "http://localhost:4002";
    let target_url = format!("{}/{}", auth_url, path);

    let service_request = ServiceRequestBuilder::new(req, target_url, &client)
        .with_content_type()
        .with_cookie()
        .with_body()
        .await
        .build();


    let service_res = service_request.send().await.map_err(|_| Error::ServiceNotAvailable)?;


    let response = ServiceResponseBuilder::new(service_res)
        .with_content_type()
        .with_status()
        .with_cookie()
        .build().await.map_err(|_|Error::CanNotParseServiceResponse)?;

    Ok(response)
}

use super::error::Result;
use crate::token::{
    extract_token_header,
    token::{Claims, validate_admin_token, validdate_token},
};
use axum::{extract::Request, middleware::Next, response::Response};
use hyper::HeaderMap;
use tracing::info;

pub async fn mw_ctx_resolver(mut req: Request, next: Next) -> Result<Response> {
    info!("{:?}", req);
    let ctx = ctx_resolver(req.headers()).await?;
    req.extensions_mut().insert(ctx);
    Ok(next.run(req).await)
}

pub async fn mw_ctx_resolver_admin(mut req: Request, next: Next) -> Result<Response> {
    let ctx = ctx_resolver_admin(req.headers()).await?;
    req.extensions_mut().insert(ctx);
    Ok(next.run(req).await)
}

async fn ctx_resolver_admin(header: &HeaderMap) -> Result<Claims> {
    let token = extract_token_header(header)?;
    let token_data = validate_admin_token(token)?;
    let claims = token_data.claims;
    Ok(claims)
}

async fn ctx_resolver(header: &HeaderMap) -> Result<Claims> {
    let token = extract_token_header(header)?;
    let token_data = validdate_token(token)?;
    let claims = token_data.claims;
    Ok(claims)
}

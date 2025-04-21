use axum::{extract::Request, middleware::Next, response::Response};
use hyper::HeaderMap;
use crate::ctx::Ctx;
use crate::router::error::Error;
use crate::router::error::Result;


pub async fn mw_ctx_resolver(
    mut req: Request,
    next: Next
) -> Result<Response>{

    let ctx = ctx_resolver(req.headers()).await?;

    req.extensions_mut().insert(ctx);

    Ok(next.run(req).await)
}

async fn ctx_resolver(header: &HeaderMap) -> Result<Ctx> {

    // let token = header.get("AUTHORIZATION").ok_or(Error::Variant1)?;

    let Some(auth_header) = header.get("AUTHORIZATION") else{
        return Err(Error::TokenMissing);
    };

    let token = auth_header
        .to_str()
        .ok()
        .and_then(|s| s.strip_prefix("Bearer "))
        .ok_or(Error::BadTokenFormat);

    // validate token -> isaac

    // exstract id from token

    let id = "testID".to_string();

    Ok(Ctx::new(id))
}

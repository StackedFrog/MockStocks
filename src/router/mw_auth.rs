use axum::{extract::{FromRequestParts, Request}, http::request::Parts, middleware::Next, response::Response};
use tower_cookies::{Cookie, Cookies};
use crate::ctx::Ctx;
use crate::router::error::Error;
use crate::router::error::Result;

pub async fn mw_auth_required(
    ctx: Result<Ctx>,
    req: Request,
    next: Next
) -> Result<Response> {

    ctx?;

    Ok(next.run(req).await)
}

pub async fn mw_ctx_resolver(
    cookies: Cookies,
    mut req: Request,
    next: Next
) -> Result<Response>{

    let ctx_result = ctx_resolver(&cookies).await;

    if ctx_result.is_err() && !matches!(ctx_result, Err(Error::TokenNotFound)){
        cookies.remove(Cookie::build("AUTH_TOKEN").build());
    }



    req.extensions_mut().insert(ctx_result);
    Ok(next.run(req).await)
}

async fn ctx_resolver(cookie: &Cookies) -> Result<Ctx> {

    let auth_token = cookie.get("AUTH_TOKEN")
        .map(|t| t.value().to_string())
        .ok_or(Error::TokenNotFound)?;

    // parse token, return struct that contains
    // username,
    // dateOfcreation
    // signature
    // -> isaac

    // fetch use for given username in token  -> bianca

    // validate token -> isaac

    // update token refrash experation time -> isaac

    // return new Ctx with user id
    Ok(Ctx::new(1))
}

impl<S: Send + Sync> FromRequestParts<S> for Ctx{
    type Rejection = Error;

    async fn from_request_parts(parts: &mut Parts,_state: &S,) -> Result<Self>{
        parts.extensions.get::<Result<Ctx>>().ok_or(Error::CtxNotFound)?.clone()
    }
}

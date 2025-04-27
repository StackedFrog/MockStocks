use axum::{extract::State, routing::{get, post}, Json, Router};
use tower_cookies::{Cookie, Cookies};
use serde::Deserialize;
use crate::{crypt, ModelManager};
use super::{Error, Result};

pub fn routes(mm : ModelManager) -> Router {
    Router::new()
        .route("/login", post(login_handler))
        .route("/registar", post(registar_handler))
        .route("/logout", post(logoff_handler))
        .with_state(mm)
}


#[derive(Debug, Deserialize)]
struct LoginPayload{
   user_name: String,
   pwd: String
}

async fn login_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>
) -> Result<()>{

    // get user from model by name

    crypt::pwd::validate_pwd(payload.pwd, "pwd".to_string())
        .map_err(|_| Error::LoginFailedPwdNotMatching)?;

    // set token
    Ok(())
}


async fn registar_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>
)-> Result<()>{

    let pwd_hash = crypt::pwd::encrypt_pwd(payload.pwd).map_err(|_| Error::FailedToEncryptPwd)?;

    // check use name uniquness

    // insert new user

    Ok(())
}


async fn logoff_handler(
    cookies: Cookies,
    Json(payload): Json<LoginPayload>
)-> Result<String> {

    println!("in logoff");
    println!("{:?}", payload);
    // remove token from cookie
    cookies.add(Cookie::new("test_cookie", "helloword"));

    Ok(payload.pwd)
}

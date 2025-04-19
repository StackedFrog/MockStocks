use axum::{extract::State, routing::post, Json, Router};
use tower_cookies::Cookies;
use serde::Deserialize;
use crate::{crypt, ModelManger};
use super::{Error, Result};

pub fn routes(mm : ModelManger) -> Router {
    Router::new()
        .route("/api/login", post(login_handler))
        .route("/api/registar", post(registar_handler))
        .route("/api/logoff", post(logoff_handler))
        .with_state(mm)
}


#[derive(Debug, Deserialize)]
struct LoginPayload{
   user_name: String,
   pwd: String
}

async fn login_handler(
    State(mm): State<ModelManger>,
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
    State(mm): State<ModelManger>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>
)-> Result<()>{

    let pwd_hash = crypt::pwd::encrypt_pwd(payload.pwd).map_err(|_| Error::FailedToEncryptPwd)?;


    // check use name uniquness

    // insert new user

    Ok(())
}


async fn logoff_handler(
    cookies: Cookies
)-> Result<()> {
    // remove token from cookie

    Ok(())
}

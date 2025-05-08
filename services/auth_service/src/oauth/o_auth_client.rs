use crate::{config::Settings, router::Result};
use oauth2::{AuthUrl, ClientId, ClientSecret, RedirectUrl, TokenUrl, basic::BasicClient};

use super::{Client, Error};

pub fn oauth_client() -> Result<Client> {
    let settings = Settings::get().clone();

    let client_id = settings.client_id;
    let client_secret = settings.client_secret;
    let redirect_url = settings.redirect_url;
    let auth_url = settings.auth_url;
    let token_url = settings.token_url;

    let client = BasicClient::new(ClientId::new(client_id))
        .set_client_secret(ClientSecret::new(client_secret))
        .set_auth_uri(AuthUrl::new(auth_url).map_err(|_| Error::FailedAuthUrl)?)
        .set_token_uri(TokenUrl::new(token_url).map_err(|_| Error::FailedTokenUrl)?)
        .set_redirect_uri(RedirectUrl::new(redirect_url).map_err(|_| Error::FailedRedirectUrl)?);

    Ok(client)
}

pub fn api_client() -> reqwest::Client {
    reqwest::Client::new()
}

pub fn token_client() -> reqwest::Client {
    let http_client = reqwest::ClientBuilder::new()
        .redirect(reqwest::redirect::Policy::none())
        .build()
        .unwrap();
    http_client
}

mod error;
pub mod oAuth_client;
pub mod oAuth_url;
pub mod oauth_autherized;
use oauth2::{
    EmptyExtraTokenFields, EndpointNotSet, EndpointSet, RevocationErrorResponseType,
    StandardErrorResponse, StandardRevocableToken, StandardTokenIntrospectionResponse,
    StandardTokenResponse,
    basic::{BasicErrorResponseType, BasicTokenType},
};

pub use self::error::{Error, Result};

pub type Client = oauth2::Client<
    StandardErrorResponse<BasicErrorResponseType>,
    StandardTokenResponse<EmptyExtraTokenFields, BasicTokenType>,
    StandardTokenIntrospectionResponse<EmptyExtraTokenFields, BasicTokenType>,
    StandardRevocableToken,
    StandardErrorResponse<RevocationErrorResponseType>,
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointSet,
>;

#[derive(Clone, Debug)]
pub struct OauthManager {
    oauth_client: Client,
    api_client: reqwest::Client,
    token_client: reqwest::Client,
}

impl OauthManager {
    pub fn new() -> Self {
        let oauth_client = oAuth_client::oauth_client().unwrap();
        let api_client = oAuth_client::api_client();
        let token_client = oAuth_client::token_client();
        Self {
            oauth_client,
            api_client,
            token_client,
        }
    }
}

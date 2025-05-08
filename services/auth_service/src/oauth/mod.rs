mod error;
pub mod o_auth_client;
pub mod o_auth_url;
pub mod oauth_autherized;
use oauth2::{
    EmptyExtraTokenFields, EndpointNotSet, EndpointSet, RevocationErrorResponseType,
    StandardErrorResponse, StandardRevocableToken, StandardTokenIntrospectionResponse,
    StandardTokenResponse,
    basic::{BasicErrorResponseType, BasicTokenType},
};

pub use self::error::Error;

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
        let oauth_client = o_auth_client::oauth_client().unwrap();
        let api_client = o_auth_client::api_client();
        let token_client = o_auth_client::token_client();
        Self {
            oauth_client,
            api_client,
            token_client,
        }
    }
}

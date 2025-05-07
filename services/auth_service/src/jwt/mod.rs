pub mod refresh_token;
mod error;

use jsonwebtoken::TokenData;
use refresh_token::{AccessToken, RefreshToken};

use crate::{crypt::token::Claims, model::{redis_token, ModelManager}};

pub use self::error::{Error, Result};

pub async fn creat_token_pair(user_id: String, mm : ModelManager) -> Result<(RefreshToken, AccessToken)>{

    let (refres_token, access_token) = generate_tokens(user_id)?;
    refres_token.store_token(mm).await?;
    Ok((refres_token, access_token))
}

fn generate_tokens(user_id: String) -> Result<(RefreshToken, AccessToken)>{

    let refres_token = RefreshToken::new(user_id.clone())?;
    let access_token = AccessToken::new(user_id.clone())?;
    Ok((refres_token, access_token))
}


pub async fn rotate_tokens( claims_old: TokenData<Claims>, mm : ModelManager ) -> Result<(RefreshToken, AccessToken)> {

    let (refres_token, access_token) = generate_tokens(claims_old.claims.sub.clone())?;
    redis_token::rotate_token(&claims_old.claims, &refres_token.claims, &refres_token.token, mm.client).await?;
    Ok((refres_token, access_token))
}

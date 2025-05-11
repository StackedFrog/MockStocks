pub mod token_util;

use jsonwebtoken::TokenData;
use token_util::{AccessToken, RefreshToken};
use uuid::Uuid;

use crate::{
    crypt::token::Claims,
    model::{ModelManager, redis_token, users_model::UserType},
    router::Result,
};

pub async fn creat_token_pair(
    user_id: Uuid,
    role: UserType,
    mm: ModelManager,
) -> Result<(RefreshToken, AccessToken)> {
    let (refres_token, access_token) = generate_tokens(user_id, role)?;
    refres_token.store_token(mm).await?;
    Ok((refres_token, access_token))
}

fn generate_tokens(user_id: Uuid, role: UserType) -> Result<(RefreshToken, AccessToken)> {
    let refres_token = RefreshToken::new(user_id.clone(), role.clone())?;
    let access_token = AccessToken::new(user_id.clone(), role.clone())?;
    Ok((refres_token, access_token))
}

pub async fn rotate_tokens(
    claims_old: TokenData<Claims>,
    mm: ModelManager,
) -> Result<(RefreshToken, AccessToken)> {
    let (refres_token, access_token) = generate_tokens(
        claims_old.claims.sub.clone(),
        claims_old.claims.role.clone(),
    )?;
    redis_token::rotate_token(
        &claims_old.claims,
        &refres_token.claims,
        &refres_token.token,
        mm.client,
    )
    .await?;
    Ok((refres_token, access_token))
}

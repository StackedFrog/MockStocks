mod error;
pub mod token;
use hyper::HeaderMap;

pub use self::error::{Error, Result};

pub fn extract_token_header(header: &HeaderMap) -> Result<&str> {
    let auth_header = header.get("AUTHORIZATION").ok_or(Error::TokenMissing)?;
    let token = auth_header
        .to_str()
        .ok()
        .and_then(|s| s.strip_prefix("Bearer "))
        .ok_or(Error::BadTokenFormat)?;
    Ok(token)
}

use tower_cookies::{Cookie, Cookies};

pub fn set_refresh_token_cookie(
    cookies: Cookies,
    refresh_token :String
){
    let cookie = Cookie::build(("refreshToken", refresh_token)).http_only(true).path("/auth/").build();
    cookies.add(cookie);
}

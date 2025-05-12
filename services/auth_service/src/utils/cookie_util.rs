use tower_cookies::{Cookie, Cookies};

pub fn set_refresh_token_cookie(cookies: Cookies, refresh_token: String) {
    set_cookie(cookies, "refreshToken".to_string(), refresh_token);
}

// pub fn set_csrf_token_cookie(cookies: Cookies, csrf_token: String) {
//     set_cookie(cookies, "CSRF_TOKEN".to_string(), csrf_token);
// }

fn set_cookie(cookies: Cookies, cookie_name: String, cookie_value: String) {
    let cookie = Cookie::build((cookie_name, cookie_value))
        .http_only(true)
        .path("/auth/")
        .build();
    cookies.add(cookie);
}

pub fn remove_refresh_token_cookie(cookies: Cookies) {
    let mut cookie = Cookie::from("refreshToken");
    cookie.set_path("/auth/");

    cookies.remove(cookie);
}

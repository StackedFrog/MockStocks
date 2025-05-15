use tower_cookies::{Cookie, Cookies};

pub fn set_refresh_token_cookie(cookies: Cookies, refresh_token: String) {
    set_cookie(
        cookies,
        "refreshToken".to_string(),
        refresh_token,
        "/auth/".to_string(),
    );
}

// pub fn set_csrf_token_cookie(cookies: Cookies, csrf_token: String) {
//     set_cookie(cookies, "CSRF_TOKEN".to_string(), csrf_token);
// }

pub fn set_dash_token_cookie(cookies: Cookies, grafana_token: String) {
    set_cookie(
        cookies,
        "grafanaToken".to_string(),
        grafana_token,
        "/auth/grafana/".to_string(),
    );
}

fn set_cookie(cookies: Cookies, cookie_name: String, cookie_value: String, path: String) {
    let cookie = Cookie::build((cookie_name, cookie_value))
        .http_only(true)
        .path(path)
        .build();
    cookies.add(cookie);
}

pub fn remove_all_cookies(cookies: Cookies) {
    remove_dash_token_cookie(cookies.clone());
    remove_refresh_token_cookie(cookies);
}

pub fn remove_dash_token_cookie(cookies: Cookies) {
    let mut cookie = Cookie::from("grafanaToken");
    cookie.set_path("/auth/grafana/");

    cookies.remove(cookie);
}

pub fn remove_refresh_token_cookie(cookies: Cookies) {
    let mut cookie = Cookie::from("refreshToken");
    cookie.set_path("/auth/");

    cookies.remove(cookie);
}

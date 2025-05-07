use hyper::Uri;

pub fn target_url(service_url: &str, path: String, uri: &Uri) -> String {
    let mut target_url = format!("{}/{}", service_url, path);

    if let Some(quary) = uri.query() {
        target_url = format!("{}?{}", target_url, quary);
    }
    target_url
}

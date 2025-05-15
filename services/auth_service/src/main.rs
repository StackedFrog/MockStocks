use ::telemetry::tracing_propegation;
use axum::Router;
use model::{
    ModelManager,
    users_model::{NewUser, add_user},
};
use telemetry::telemetry;
use tower_cookies::CookieManagerLayer;
use tower_http::trace::{DefaultOnResponse, TraceLayer};

mod config;
mod crypt;
mod jwt;
mod model;
mod oauth;
mod router;
mod utils;

#[tokio::main]
async fn main() {
    telemetry::init_telemetry(&config::Settings::get().cargo_pkg_name);

    let mm = ModelManager::new().await;

    let router_user = router::routes_user::routes(mm.clone());
    let router_admin = router::routes_admin::routes(mm.clone());

    let pwd = crypt::pwd::encrypt_pwd("pwd".to_string()).unwrap();

    let user = NewUser::new_admin("test@test".to_string(), "admin".to_string(), pwd);

    let _ = add_user(&mm.pool, user).await;

    let app = Router::new()
        .merge(router::routes_login::routes(mm))
        .nest("/user", router_user)
        .nest("/admin", router_admin)
        .layer(CookieManagerLayer::new())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(tracing_propegation::propagate_tracing)
                .on_response(DefaultOnResponse::new().include_headers(true)),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4002").await.unwrap();

    println!("server running on 4002");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

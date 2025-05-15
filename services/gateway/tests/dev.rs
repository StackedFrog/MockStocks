use anyhow::Result;
use hyper::header;
use reqwest::cookie;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tower_cookies::cookie::CookieBuilder;

#[derive(Deserialize)]
struct TokenPayload {
    token: String,
}
#[derive(Serialize)]
struct UpdatePwd {
    old_pwd: String,
    new_pwd: String,
}
#[tokio::test]
async fn test_server() -> Result<()> {
    let gateway_url = "http://localhost:4001".to_string();

    let cli = httpc_test::new_client("http://localhost:4001").unwrap();
    let res = cli
        .do_post(
            "/auth/login",
            json!({"email":"svenarne.lindstroem@gmail.com", "pwd":"pwd"}),
        )
        .await?;

    res.print().await?;

    let body: TokenPayload = res.json_body_as()?;
    let token = body.token;
    let access_token = format!("Bearer {}", token);

    let client = cli.reqwest_client();

    let res3 = client
        .get(format!(
            "{}/api/stocks_api/stocks?symbol=AAPL,MSFT",
            gateway_url
        ))
        .header(header::AUTHORIZATION, access_token)
        .send()
        .await
        .unwrap();

    println!("{:?}", res3);

    //    let res = cli.do_post("/auth/user/change_pwd", json!({"email":"test@me2344", "pwd":"pwd2"}))
    //        .await?.print().await?;
    //
    //    let res = cli.do_post("/auth/admin/update_role", json!({"email":"test@me2344", "pwd":"pwd2"}))
    //        .await?.print().await?;

    // let res = cli.do_post("/auth/login", json!({"email":"test@me2344", "pwd":"pwd2"}))
    //     .await?;
    //
    //  res.print()
    //     .await?;
    //
    // println!("----- {:?}", res3);
    //
    //     // cli.do_post("/auth/refresh", json!({"email":"test@me2344", "pwd":"pwd"}))
    // .await?.print().await?;
    //

    //
    // cli.do_post(
    //     "/auth/register",
    //     json!({"email":"test@me2344","username":"sv223", "pwd":"pwd"}),
    // )
    // .await?
    // .print()
    // .await?;
    //
    // cli.do_post(
    //     "/auth/logout",
    //     json!({"username":"svennnnnnnnnn", "pwd":"pwd"}),
    // )
    // .await?
    // .print()
    // .await?;
    //

    // cli.do_post("/auth/login", json!({"email":"test@me2344", "pwd":"pwd"}))
    //     .await?
    //     .print()
    //     .await?;

    // cli.do_post(
    //     "/auth/refresh",
    //     json!({"username":"svennnnnnnnnn", "pwd":"pwd"}),
    // )
    // .await?
    // .print()
    // .await?;

    // let cookie = cli.cookie_value("refreshToken").unwrap().clone();
    //
    // cli.do_post("/auth/refresh", json!({"user_name":"sven", "pwd":"pwd"}))
    //     .await?.print().await?;

    // println!("Cookie: {:?}", cookie);
    //
    // let client = cli.reqwest_client();
    //
    // let res3 = client
    //     .post(format!("{}/auth/refresh", gateway_url))
    //     .header(header::COOKIE, "refreshToken=tttt")
    //     .send()
    //     .await
    //     .unwrap();
    //
    // println!("Res Body: {:?}", res3.text().await.unwrap());
    //
    // let res4 = client
    //     .get("http://localhost:4001/api/stocks_api/stocks?symbol=AAPL,MSFT")
    //     .header(header::AUTHORIZATION, "tttt")
    //     .send()
    //     .await
    //     .unwrap();
    //
    // println!("Res Body: {:?}", res4.text().await.unwrap());

    Ok(())
}

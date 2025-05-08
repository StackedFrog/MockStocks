use anyhow::Result;
use hyper::header;
use reqwest::cookie;
use serde_json::json;
use tower_cookies::cookie::CookieBuilder;

#[tokio::test]
async fn test_server() -> Result<()> {
    let gateway_url = "http://localhost:4001".to_string();

    let cli = httpc_test::new_client("http://localhost:4001").unwrap();

    let res = cli
        .do_post("/auth/register", json!({"username":"sven", "pwd":"pwd"}))
        .await?;

    let body = res.json_body();
    res.print().await?;

    println!("---------- {:?} -------", body);

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

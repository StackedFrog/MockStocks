use anyhow::Result;
use serde_json::json;



#[tokio::test]
async fn test_server()-> Result<()> {

    let cli = httpc_test::new_client("http://localhost:4001").unwrap();

    let res = cli.do_post("/auth/login",
        json!({"user_name":"sven", "pwd":"pwd"})
    ).await?;

    res.print().await?;


    let res2 = cli.do_post("/auth/refresh",
        json!({"user_name":"sven", "pwd":"pwd"})
    ).await?;

    res2.print().await?;



    Ok(())

}

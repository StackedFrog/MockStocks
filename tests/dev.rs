use anyhow::Result;
use serde_json::json;



#[tokio::test]
async fn test_server()-> Result<()> {

    let cli = httpc_test::new_client("http://localhost:4001").unwrap();

    let res = cli.do_post("/auth/logout",
        json!({"user_name":"sven", "pwd":"test_pwd"})
    ).await?;
    res.print().await?;







    Ok(())

}

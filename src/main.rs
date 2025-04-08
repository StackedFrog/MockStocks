mod _dev_utils;
mod model;


#[tokio::main]
async fn main() {
    println!("Hello, world!");
    
    let db = model::Db::new().await;

    _dev_utils::db_setup::call_everything(db.pool).await;
    
}

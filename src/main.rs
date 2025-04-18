use model::usersModel;

mod _dev_utils;
mod model;


#[tokio::main]
async fn main() {
    println!("Hello, world!");
    
    let db = model::Db::new().await;

    _dev_utils::db_setup::init_database(&db.pool).await;

    let users = usersModel::get_all_users(&db.pool).await;

    println!("{:?}", users);
}

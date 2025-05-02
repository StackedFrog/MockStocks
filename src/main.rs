use model::users_model;

mod _dev_utils;
mod model;

#[tokio::main]
async fn main() {
    let db = model::Db::new().await;

    _dev_utils::db_setup::init_database(&db.pool).await;

    let users = users_model::get_all_users(&db.pool).await;

    println!("{:?}", users);
}

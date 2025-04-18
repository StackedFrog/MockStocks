use crate::model::Pool;
use uuid::Uuid;

#[derive(Debug)]
pub struct User {
    user_id: Uuid,
    username: String,
    password: String,
    role: String,
    pass_salt: Uuid,
    token_salt: Uuid
}

pub async fn get_all_users(pool : &Pool) -> Vec<User> {
    let query = "SELECT * FROM Users";
    let users : Vec<User> = sqlx::query_as(&query).fetch_all(pool).await.expect("error");

    return users;
}
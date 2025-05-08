use crate::model::Pool;
use crate::model::error::{Error, Result};
use uuid::Uuid;

// update user password
pub async fn update_password(pool: &Pool, id: Uuid, new_password: String) -> Result<()> {
    let query = "UPDATE Users SET password = ? WHERE user_id = ?";
    sqlx::query(query)
        .bind(new_password)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::PasswordNotUpdated)?;

    return Ok(());
}

// delete user
pub async fn delete_user(pool: &Pool, id: Uuid) -> Result<()> {
    let query = "DELETE FROM Users WHERE user_id = ?";
    sqlx::query(query)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::UserNotDeleted)?;

    return Ok(());
}

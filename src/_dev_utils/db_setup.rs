use crate::model::Pool;
use std::fs;

// call all 3 functions
pub async fn call_everything(pool : Pool) {
    let path = "sql/init_db.sql";
    let path = "sql/delete_db.sql";
    let path = "sql/init_db.sql";
    create_db_structure(pool, ).await;

}

// get deletion sql script and send to db


// get creation sql script and send to db
async fn create_db_structure(pool : Pool, path : String) {
    let path = "sql/init_db.sql";
    let content = fs::read_to_string(path)
        .expect("Could not read file");

    let statements : Vec<&str>= content.split(';').collect();

    for s in statements {
        sqlx::query(&s).execute(&pool).await
        .expect("could not create db structure");
        println!("Successful statement execution woo");
    }
    println!("{content}");
}



// get insertion sql script and send to db
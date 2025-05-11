// use crate::model::Pool;
// use std::fs;
//
//
// pub async fn init_database(pool : &Pool) {
//     let init_file = "sql/init_db.sql";
//     let clear_file = "sql/clear_db.sql";
//     let populate_file = "sql/populate_db.sql";
//     execute_sql_file(pool, clear_file).await;
//     println!("Database cleared");
//     execute_sql_file(pool, init_file).await;
//     println!("Database initialised");
//     execute_sql_file(pool, populate_file).await;
//     println!("Database populated");
// }
//
// // read file content to string
// fn read_file(filename : &str) -> String {
//     fs::read_to_string(filename).expect("Could not read file")
// }
//
// // get sql script and send to db
// async fn execute_sql_file(pool : &Pool, filename : &str) {
//     let file_content = read_file(filename);
//
//     // split content string into SQL statements
//     let statements : Vec<&str>= file_content.split(';').collect();
//
//     // execute each statement
//     for mut s in statements {
//         s = s.trim();
//         sqlx::query(&s).execute(pool).await
//         .expect("could not run SQL script");
//     }
// }

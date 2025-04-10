//
//  define context that will be placed in
//  req after validation will contain user id
//  for db quaries
//
//
//

#[derive(Debug, Clone)]
pub struct Ctx {
    user_id: u64
}

impl Ctx {
    pub fn new (id: u64) -> Self{
        Ctx{user_id: id}
    }
}

impl Ctx {
    pub fn user_id(&self) -> u64{
        self.user_id
    }
}

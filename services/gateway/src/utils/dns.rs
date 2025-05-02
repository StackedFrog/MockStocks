use super::{Result, Error};



pub trait DNS<'a> {
    fn to_domain(self)-> Result<&'a Self>;
    // add code here
}


impl <'a> DNS <'a> for &str{
    fn to_domain(self)-> Result<&'a Self>{
        match self {
            "auth" => Ok(&"http://auth:4002"),
            _ => Err(Error::CanNotParesServiceName)
        }
    }
}

use super::{Error, Result};

pub trait DNS<'a> {
    fn to_domain(self) -> Result<&'a Self>;
    // add code here
}

impl<'a> DNS<'a> for &str {
    fn to_domain(self) -> Result<&'a Self> {
        match self {
<<<<<<< HEAD
            "auth" => Ok(&"http://auth:4002"),
=======
            "auth" => Ok(&"http://auth:4002/"),
            "stocks_api" => Ok(&"http://stocks_api_service:4003/"),
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
            _ => Err(Error::CanNotParesServiceName),
        }
    }
}

use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::SaltString;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use super::{Error, Result};

pub fn validate_pwd(
    pwd_clear: String,
    pwd: String
) -> Result<()> {
    let pwd_hash = PasswordHash::new(&pwd).map_err(|_| Error::PwdWrongFormat)?;
    Argon2::default().verify_password(pwd_clear.as_bytes(), &pwd_hash)
        .map_err(|_| Error::PwdNotMatching)?;
    Ok(())
}

pub fn encrypt_pwd(
    pwd_clear: String
) -> Result<String>{
    let salt = SaltString::generate(&mut OsRng);
    _encrypt_pwd(pwd_clear, salt)
}

fn _encrypt_pwd(
    pwd_clear: String,
    salt: SaltString
) -> Result<String>{
    let argon = Argon2::default();
    let pwd_hash = argon.hash_password(pwd_clear.as_bytes(), &salt)
        .map_err(|_| Error::PwdFailedHash)?.to_string();
    Ok(pwd_hash)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_pwd(){
        let pwd_clear = "test_pwd".to_string();
        let res = encrypt_pwd(pwd_clear.clone()).unwrap();
        assert_eq!(validate_pwd(pwd_clear, res).is_ok(), true);
    }

    #[test]
    fn test_validate_pwd_error(){
        let pwd_clear = "test_pwd".to_string();
        let pwd_wrong = "not_matching".to_string();
        let res = encrypt_pwd(pwd_clear.clone()).unwrap();
        assert_eq!(validate_pwd(pwd_wrong, res).is_err(), true);
    }

    #[test]
    fn test_encrypt_pwd(){
        let salt = SaltString::generate(&mut OsRng);
        let pwd = "test_pwd".to_string();

        let encrypted_pwd1 = _encrypt_pwd(pwd.clone(), salt.clone()).unwrap();
        let encrypted_pwd2 = _encrypt_pwd(pwd.clone(), salt.clone()).unwrap();
        assert_eq!(encrypted_pwd1, encrypted_pwd2);
    }

    #[test]
    fn test_encrypt_pwd_error(){
        let salt1 = SaltString::generate(&mut OsRng);
        let salt2 = SaltString::generate(&mut OsRng);
        let pwd = "test_pwd".to_string();

        let encrypted_pwd1 = _encrypt_pwd(pwd.clone(), salt1.clone()).unwrap();
        let encrypted_pwd2 = _encrypt_pwd(pwd.clone(), salt2.clone()).unwrap();
        assert_ne!(encrypted_pwd1, encrypted_pwd2);
    }
}

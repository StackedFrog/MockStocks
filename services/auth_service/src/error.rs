use crate::model;

pub enum Error {
    Model(model::Error),
}

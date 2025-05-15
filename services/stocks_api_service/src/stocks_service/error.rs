use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;

pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    ApiConnectorFailure,
    FailedToFetch,
    FailedToExtractQuote,
    TooManySymbols,
    FailedtoFetchMultipleQuotes,
    FailedToParse,
    FailedToSearchForTicker,
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let status_code = match self {
            Error::TooManySymbols => StatusCode::BAD_REQUEST,
            Error::ApiConnectorFailure => StatusCode::SERVICE_UNAVAILABLE,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        };

        let message = match self {
            Error::ApiConnectorFailure => "Failed to connect to data provider",
            Error::FailedToFetch => "Failed to fetch data",
            Error::FailedToExtractQuote => "Failed to process data",
            Error::TooManySymbols => "Too many symbols requested (max: 10)",
            Error::FailedtoFetchMultipleQuotes => "Failed to fetch multiple quotes",
            Error::FailedToParse => "Failed to parse the data.",
            Error::FailedToSearchForTicker => "Failed to search for ticker",
        };

        (status_code, Json(json!({ "error": message }))).into_response()
    }
}

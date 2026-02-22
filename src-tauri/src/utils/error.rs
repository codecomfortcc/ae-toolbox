use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct AppError {
    pub message: String,
}

impl From<String> for AppError {
    fn from(value: String) -> Self {
        Self { message: value }
    }
}

impl From<&str> for AppError {
    fn from(value: &str) -> Self {
        Self {
            message: value.to_string(),
        }
    }
}

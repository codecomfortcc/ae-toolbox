use thiserror::Error;

#[derive(Error, Debug)]
pub enum EngineError {

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Source path not found")]
    SourceNotFound,

    #[error("Invalid asset type")]
    InvalidAssetType,

    #[error("Task not found")]
    TaskNotFound,

    #[error("Task already exists")]
    TaskAlreadyExists,

    #[error("Internal error: {0}")]
    Internal(String),
}

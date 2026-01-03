use thiserror::Error;

#[derive(Error, Debug)]
pub enum InstallError {
    #[error("IO error")]
    Io(#[from] std::io::Error),

    #[error("Adobe installer failed: {0}")]
    Adobe(String),
}

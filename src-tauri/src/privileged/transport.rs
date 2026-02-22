use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use tokio::sync::mpsc;

use engine_core::{
    events::BackendEvent,
    types::InstallJob,
};

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum TransportRequest {
    Install { job: InstallJob },
    Shutdown,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum TransportResponse {
    Event { event: BackendEvent },
    Ack,
    Error { message: String },
}

#[derive(Debug)]
pub enum TransportError {
    ConnectionFailed(String),
    SendFailed(String),
    ReceiveFailed(String),
    SerializationFailed(String),
}

impl From<serde_json::Error> for TransportError {
    fn from(err: serde_json::Error) -> Self {
        TransportError::SerializationFailed(err.to_string())
    }
}

#[async_trait]
pub trait Transport: Send + Sync {
    async fn connect(&mut self) -> Result<(), TransportError>;
    async fn send_job(&self, job: InstallJob) -> Result<(), TransportError>;
    async fn send_request(
        &self,
        request: TransportRequest,
    ) -> Result<(), TransportError>;
    fn subscribe(&self) -> mpsc::UnboundedReceiver<BackendEvent>;
    async fn shutdown(&self) -> Result<(), TransportError>;
}

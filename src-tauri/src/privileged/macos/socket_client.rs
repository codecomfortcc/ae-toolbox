use async_trait::async_trait;
use tokio::net::UnixStream;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::sync::mpsc;

use engine_core::{
    events::BackendEvent,
    types::InstallJob,
};

use crate::privileged::transport::{
    Transport,
    TransportError,
    TransportRequest,
    TransportResponse,
};

const SOCKET_PATH: &str = "/var/run/ae_toolbox.sock";

pub struct MacOSSocketTransport {
    stream: tokio::sync::Mutex<Option<UnixStream>>,
    event_tx: mpsc::UnboundedSender<BackendEvent>,
    event_rx: tokio::sync::Mutex<Option<mpsc::UnboundedReceiver<BackendEvent>>>,
}

impl MacOSSocketTransport {
    pub fn new() -> Self {
        let (tx, rx) = mpsc::unbounded_channel();
        Self {
            stream: tokio::sync::Mutex::new(None),
            event_tx: tx,
            event_rx: tokio::sync::Mutex::new(Some(rx)),
        }
    }
}

#[async_trait]
impl Transport for MacOSSocketTransport {

    async fn connect(&mut self) -> Result<(), TransportError> {
        let stream = UnixStream::connect(SOCKET_PATH)
            .await
            .map_err(|e| TransportError::ConnectionFailed(e.to_string()))?;

        *self.stream.lock().await = Some(stream);
        Ok(())
    }

    async fn send_job(&self, job: InstallJob) -> Result<(), TransportError> {
        let request = TransportRequest::Install { job };
        self.send_request(request).await
    }

    async fn send_request(
        &self,
        request: TransportRequest,
    ) -> Result<(), TransportError> {

        let json = serde_json::to_string(&request)?;

        let mut guard = self.stream.lock().await;
        let stream = guard.as_mut()
            .ok_or(TransportError::ConnectionFailed("Not connected".into()))?;

        stream.write_all(json.as_bytes())
            .await
            .map_err(|e| TransportError::SendFailed(e.to_string()))?;

        Ok(())
    }

    fn subscribe(&self) -> mpsc::UnboundedReceiver<BackendEvent> {
        self.event_rx
            .blocking_lock()
            .take()
            .expect("Already subscribed")
    }

    async fn shutdown(&self) -> Result<(), TransportError> {
        Ok(())
    }
}

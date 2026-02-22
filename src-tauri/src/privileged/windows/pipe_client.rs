use async_trait::async_trait;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::sync::mpsc;
use tokio_named_pipes::NamedPipeClient;

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

const PIPE_NAME: &str = r"\\.\pipe\ae_toolbox";

pub struct WindowsPipeTransport {
    writer: tokio::sync::Mutex<Option<NamedPipeClient>>,
    event_tx: mpsc::UnboundedSender<BackendEvent>,
    event_rx: tokio::sync::Mutex<Option<mpsc::UnboundedReceiver<BackendEvent>>>,
}

impl WindowsPipeTransport {
    pub fn new() -> Self {
        let (tx, rx) = mpsc::unbounded_channel();

        Self {
            writer: tokio::sync::Mutex::new(None),
            event_tx: tx,
            event_rx: tokio::sync::Mutex::new(Some(rx)),
        }
    }

    async fn start_reader(
        mut pipe: NamedPipeClient,
        event_sender: mpsc::UnboundedSender<BackendEvent>,
    ) {
        tokio::spawn(async move {
            let mut buffer = vec![0u8; 8192];

            loop {
                match pipe.read(&mut buffer).await {
                    Ok(0) => break,
                    Ok(n) => {
                        if let Ok(text) = std::str::from_utf8(&buffer[..n]) {
                            if let Ok(resp) = serde_json::from_str::<TransportResponse>(text) {
                                if let TransportResponse::Event { event } = resp {
                                    let _ = event_sender.send(event);
                                }
                            }
                        }
                    }
                    Err(_) => break,
                }
            }
        });
    }
}

#[async_trait]
impl Transport for WindowsPipeTransport {

    async fn connect(&mut self) -> Result<(), TransportError> {
        let pipe = NamedPipeClient::connect(PIPE_NAME)
            .await
            .map_err(|e| TransportError::ConnectionFailed(e.to_string()))?;

        Self::start_reader(pipe.try_clone().unwrap(), self.event_tx.clone()).await;

        *self.writer.lock().await = Some(pipe);

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

        let mut guard = self.writer.lock().await;
        let pipe = guard.as_mut().ok_or(
            TransportError::ConnectionFailed("Not connected".into())
        )?;

        pipe.write_all(json.as_bytes())
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

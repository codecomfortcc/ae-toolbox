use tauri::AppHandle;
use tokio::sync::mpsc;

use engine_core::events::BackendEvent;

use crate::privileged::interface::PrivilegedEngine;

pub struct AppState {
    pub app: AppHandle,
    pub engine: Box<dyn PrivilegedEngine + Send + Sync>,
    pub event_tx: mpsc::UnboundedSender<BackendEvent>,
}

impl AppState {
    pub fn new(app: AppHandle) -> Self {
        let (tx, rx) = mpsc::unbounded_channel();

        let engine = crate::privileged::factory::create_engine(rx);

        Self {
            app,
            engine,
            event_tx: tx,
        }
    }
}

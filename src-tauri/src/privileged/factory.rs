use tokio::sync::mpsc;
use engine_core::events::BackendEvent;
use engine_core::types::InstallJob;

use super::interface::PrivilegedEngine;

pub fn create_engine(
    _rx: mpsc::UnboundedReceiver<BackendEvent>,
) -> Box<dyn PrivilegedEngine + Send + Sync> {
    Box::new(LocalStubEngine)
}

struct LocalStubEngine;

#[async_trait::async_trait]
impl PrivilegedEngine for LocalStubEngine {
    async fn send_job(&self, _job: InstallJob) -> Result<(), String> {
        println!("Stub engine received job");
        Ok(())
    }
}

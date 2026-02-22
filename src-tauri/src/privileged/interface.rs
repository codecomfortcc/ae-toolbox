use async_trait::async_trait;
use engine_core::types::InstallJob;

#[async_trait]
pub trait PrivilegedEngine {
    async fn send_job(&self, job: InstallJob) -> Result<(), String>;
}

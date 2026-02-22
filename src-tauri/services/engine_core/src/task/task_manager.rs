use dashmap::DashMap;
use tokio::sync::mpsc;
use tokio::task::JoinHandle;
use uuid::Uuid;

use crate::{
    installer::installer_engine::InstallerEngine,
    types::InstallJob,
    events::BackendEvent,
    errors::EngineError,
};

pub struct TaskManager {
    tasks: DashMap<Uuid, JoinHandle<()>>,
    event_sender: mpsc::UnboundedSender<BackendEvent>,
}

impl TaskManager {

    pub fn new(event_sender: mpsc::UnboundedSender<BackendEvent>) -> Self {
        Self {
            tasks: DashMap::new(),
            event_sender,
        }
    }

    pub async fn submit(&self, job: InstallJob) -> Result<(), EngineError> {

        if self.tasks.contains_key(&job.id) {
            return Err(EngineError::TaskAlreadyExists);
        }

        let task_id = job.id;

        let _ = self.event_sender.send(
            BackendEvent::TaskCreated { task_id }
        );

        let sender = self.event_sender.clone();

        let handle = tokio::spawn(async move {
            InstallerEngine::run(job, sender).await;
        });

        self.tasks.insert(task_id, handle);

        Ok(())
    }

    pub fn cancel(&self, id: Uuid) -> Result<(), EngineError> {
        if let Some((_, handle)) = self.tasks.remove(&id) {
            handle.abort();
            let _ = self.event_sender.send(
                BackendEvent::TaskCancelled { task_id: id }
            );
            return Ok(());
        }

        Err(EngineError::TaskNotFound)
    }
}

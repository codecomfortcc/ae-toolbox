use serde::{Serialize, Deserialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event", rename_all = "snake_case")]
pub enum BackendEvent {

    TaskCreated {
        task_id: Uuid,
    },

    TaskProgress {
        task_id: Uuid,
        stage: String,
        progress: f32,
        message: String,
    },

    TaskCompleted {
        task_id: Uuid,
        success: bool,
        error: Option<String>,
    },

    TaskCancelled {
        task_id: Uuid,
    }
}

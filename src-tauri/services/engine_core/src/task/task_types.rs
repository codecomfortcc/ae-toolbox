use uuid::Uuid;

#[derive(Debug, Clone, PartialEq)]
pub enum TaskStatus {
    Queued,
    Running,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Debug, Clone)]
pub struct TaskState {
    pub id: Uuid,
    pub status: TaskStatus,
    pub progress: f32,
}

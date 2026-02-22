use std::path::{PathBuf};
use tokio::sync::mpsc::UnboundedSender;
use uuid::Uuid;

use crate::{
    types::InstallJob,
    events::BackendEvent,
    errors::EngineError,
};

use super::atomic_install::{
    atomic_copy_file,
    copy_directory_recursive,
};

pub struct InstallerEngine;

impl InstallerEngine {

    pub async fn run(
        job: InstallJob,
        sender: UnboundedSender<BackendEvent>,
    ) {

        let id = job.id;

        match Self::install(job.clone(), &sender).await {
            Ok(_) => {
                let _ = sender.send(
                    BackendEvent::TaskCompleted {
                        task_id: id,
                        success: true,
                        error: None,
                    }
                );
            }
            Err(e) => {
                let _ = sender.send(
                    BackendEvent::TaskCompleted {
                        task_id: id,
                        success: false,
                        error: Some(e.to_string()),
                    }
                );
            }
        }
    }

    async fn install(
        job: InstallJob,
        sender: &UnboundedSender<BackendEvent>,
    ) -> Result<(), EngineError> {

        let id = job.id;

        let source = PathBuf::from(&job.source_path);
        let target_dir = PathBuf::from(&job.target_path);

        if !source.exists() {
            return Err(EngineError::SourceNotFound);
        }

        let _ = sender.send(BackendEvent::TaskProgress {
            task_id: id,
            stage: "preparing".into(),
            progress: 0.1,
            message: "Preparing installation".into(),
        });

        tokio::task::spawn_blocking({
            let target_dir = target_dir.clone();
            move || std::fs::create_dir_all(&target_dir)
        }).await??;

        let final_target = target_dir.join(
            source.file_name().unwrap()
        );

        let _ = sender.send(BackendEvent::TaskProgress {
            task_id: id,
            stage: "installing".into(),
            progress: 0.5,
            message: "Copying files".into(),
        });

        if source.is_file() {
            atomic_copy_file(&source, &final_target)?;
        } else {
            copy_directory_recursive(&source, &final_target)?;
        }

        let _ = sender.send(BackendEvent::TaskProgress {
            task_id: id,
            stage: "finalizing".into(),
            progress: 0.9,
            message: "Finalizing installation".into(),
        });

        Ok(())
    }
}

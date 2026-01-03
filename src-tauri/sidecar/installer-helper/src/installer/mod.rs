pub mod file;
pub mod adobe;
use crate::jobs::{BackendError, JobKind, JobRequest};
use serde_json::Value;

pub fn dispatch(job: JobRequest) -> Result<Option<Value>, BackendError> {
    match job.kind {
      JobKind::OpenFolder => file::open_directory(job),
        JobKind::InstallFile => file::install(job),
        JobKind::Revert => file::revert(job),
        JobKind::List => file::list_all(),
        JobKind::DetectAE => file::detect_ae_versions(),
        JobKind::GetFolders => file::get_folders(job),
        JobKind::InstallZxp => adobe::install_zxp(job),
        JobKind::InstallCcx => adobe::install_ccx(job),
        JobKind::Delete | JobKind::DeleteAll => file::uninstall(job),
  
    }
}

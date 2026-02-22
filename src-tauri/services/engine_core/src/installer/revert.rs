use std::path::Path;
use crate::errors::EngineError;

pub fn revert_file(backup_path: &str, target_path: &str) -> Result<(), EngineError> {

    let backup = Path::new(backup_path);
    let target = Path::new(target_path);

    if !backup.exists() {
        return Err(EngineError::SourceNotFound);
    }

    if target.exists() {
        std::fs::remove_file(target)?;
    }

    std::fs::copy(backup, target)?;

    Ok(())
}

use std::path::Path;
use crate::errors::EngineError;

pub fn uninstall_path(path: &str) -> Result<(), EngineError> {

    let p = Path::new(path);

    if !p.exists() {
        return Ok(());
    }

    if p.is_dir() {
        std::fs::remove_dir_all(p)?;
    } else {
        std::fs::remove_file(p)?;
    }

    Ok(())
}

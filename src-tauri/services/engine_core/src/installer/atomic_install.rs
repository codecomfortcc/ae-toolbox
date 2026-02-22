use std::path::{Path, PathBuf};
use std::fs;
use crate::errors::EngineError;

pub fn atomic_copy_file(src: &Path, dest: &Path) -> Result<(), EngineError> {

    let temp = dest.with_extension("tmp");

    fs::copy(src, &temp)?;

    if dest.exists() {
        fs::remove_file(dest)?;
    }

    fs::rename(temp, dest)?;

    Ok(())
}

pub fn copy_directory_recursive(src: &Path, dest: &Path) -> Result<(), EngineError> {

    if dest.exists() {
        fs::remove_dir_all(dest)?;
    }

    fs::create_dir_all(dest)?;

    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let path = entry.path();
        let target = dest.join(entry.file_name());

        if path.is_dir() {
            copy_directory_recursive(&path, &target)?;
        } else {
            fs::copy(&path, &target)?;
        }
    }

    Ok(())
}

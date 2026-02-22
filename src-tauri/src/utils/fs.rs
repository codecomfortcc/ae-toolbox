use std::fs;
use std::io;
use std::path::{Path, PathBuf};

/// Create directory if it does not exist.
pub fn ensure_dir(path: &Path) -> io::Result<()> {
    if !path.exists() {
        fs::create_dir_all(path)?;
    }
    Ok(())
}

/// Remove file if exists.
pub fn remove_file_if_exists(path: &Path) -> io::Result<()> {
    if path.exists() && path.is_file() {
        fs::remove_file(path)?;
    }
    Ok(())
}

/// Remove directory if exists.
pub fn remove_dir_if_exists(path: &Path) -> io::Result<()> {
    if path.exists() && path.is_dir() {
        fs::remove_dir_all(path)?;
    }
    Ok(())
}

/// Atomic file copy:
/// 1. Copy to temp file
/// 2. Remove existing
/// 3. Rename temp -> final
pub fn atomic_copy_file(src: &Path, dest: &Path) -> io::Result<()> {
    let temp_path = dest.with_extension("tmp");

    fs::copy(src, &temp_path)?;

    if dest.exists() {
        fs::remove_file(dest)?;
    }

    fs::rename(temp_path, dest)?;
    Ok(())
}

/// Recursive directory copy.
pub fn copy_directory_recursive(src: &Path, dest: &Path) -> io::Result<()> {
    if !src.exists() {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            "Source directory not found",
        ));
    }

    ensure_dir(dest)?;

    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let path = entry.path();
        let target_path = dest.join(entry.file_name());

        if path.is_dir() {
            copy_directory_recursive(&path, &target_path)?;
        } else {
            fs::copy(&path, &target_path)?;
        }
    }

    Ok(())
}

/// Safe move (works across drives).
pub fn move_path(src: &Path, dest: &Path) -> io::Result<()> {
    match fs::rename(src, dest) {
        Ok(_) => Ok(()),
        Err(_) => {
            // fallback for cross-volume move
            if src.is_file() {
                fs::copy(src, dest)?;
                fs::remove_file(src)?;
            } else {
                copy_directory_recursive(src, dest)?;
                fs::remove_dir_all(src)?;
            }
            Ok(())
        }
    }
}

/// Count files inside directory (for progress estimation later).
pub fn count_files(path: &Path) -> io::Result<usize> {
    let mut count = 0;

    if path.is_file() {
        return Ok(1);
    }

    for entry in walkdir::WalkDir::new(path) {
        let entry = entry?;
        if entry.path().is_file() {
            count += 1;
        }
    }

    Ok(count)
}

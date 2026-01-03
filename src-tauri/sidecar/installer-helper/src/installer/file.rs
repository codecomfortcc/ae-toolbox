use crate::db;
use crate::jobs::{BackendError, JobKind, JobRequest};
use serde_json::{json, Value};
use std::fs;
use std::io::ErrorKind;
use std::path::{Path, PathBuf};
use std::process::Command;

fn err(code: &str, msg: &str) -> BackendError {
    BackendError {
        code: code.into(),
        message: msg.into(),
    }
}

/* ---------- INSTALL ---------- */

pub fn install(job: JobRequest) -> Result<Option<Value>, BackendError> {
    let src_path = job.source.ok_or(err("INVALID_INPUT", "Source missing"))?;
    let ae_ver = job.ae_version.ok_or(err("INVALID_INPUT", "AE version missing"))?;
    let src = Path::new(&src_path);

    let file_name = src.file_name()
        .ok_or(err("INVALID_FILE", "Invalid file"))?
        .to_string_lossy()
        .to_string();

    let ext = src.extension().and_then(|s| s.to_str()).unwrap_or("").to_lowercase();

    let mut dest = PathBuf::from(format!(
        "C:\\Program Files\\Adobe\\Adobe After Effects {}\\Support Files",
        ae_ver
    ));

    match ext.as_str() {
        "jsx" | "jsxbin" => dest.push("Scripts\\ScriptUI Panels"),
        "aex" => dest.push("Plug-ins"),
        "ffx" => dest.push("Presets"),
        _ => return Err(err("UNSUPPORTED", "Unsupported file type")),
    }

    if let Some(sub) = job.path.clone() {
        dest.push(sub);
    }

    fs::create_dir_all(&dest).map_err(|e| {
        if e.kind() == ErrorKind::PermissionDenied {
            err("ADMIN_REQUIRED", "Run AE Toolbox as Administrator")
        } else {
            err("DIR_CREATE_FAILED", &e.to_string())
        }
    })?;

    let install_at = dest.join(&file_name);
    let conn = db::get_conn().map_err(|e| err("DB_ERROR", &e))?;

    let (pid, next_v) =
        db::register_install(&conn, &file_name, &ae_ver, &install_at.to_string_lossy())
            .map_err(|e| err("DB_ERROR", &e))?;

    let backup_dir = PathBuf::from("C:\\ProgramData\\AE-Toolbox\\versions")
        .join(format!("{}_{}", file_name, ae_ver))
        .join(format!("v{}", next_v));

    fs::create_dir_all(&backup_dir).map_err(|e| err("BACKUP_FAILED", &e.to_string()))?;
    let backup_path = backup_dir.join(&file_name);

    fs::copy(src, &backup_path).map_err(|e| err("BACKUP_COPY_FAILED", &e.to_string()))?;
    if install_at.exists() {
        fs::remove_file(&install_at).map_err(|e| err("CLEANUP_FAILED", &e.to_string()))?;
    }
    fs::copy(src, &install_at).map_err(|e| err("INSTALL_FAILED", &e.to_string()))?;

    db::update_version(&conn, pid, next_v, &backup_path.to_string_lossy())
        .map_err(|e| err("DB_ERROR", &e))?;

    Ok(Some(json!({ "path": install_at })))
}

/* ---------- UNINSTALL / DELETE ---------- */

pub fn uninstall(job: JobRequest) -> Result<Option<Value>, BackendError> {
    let target = job.path.ok_or(err("INVALID_INPUT", "Target path missing"))?;
    let p = Path::new(&target);

    if p.exists() {
        if p.is_dir() {
            fs::remove_dir_all(p).map_err(|e| err("DELETE_FAILED", &e.to_string()))?;
        } else {
            fs::remove_file(p).map_err(|e| err("DELETE_FAILED", &e.to_string()))?;
        }
    }

    let conn = db::get_conn().map_err(|e| err("DB_ERROR", &e))?;
    match job.kind {
        JobKind::DeleteAll => {
            db::wipe_plugin(&conn, &target).map_err(|e| err("DB_ERROR", &e))?;
        }
        _ => {
            conn.execute(
                "UPDATE installed_plugins SET current_version = 0 WHERE install_path = ?1",
                [target],
            )
            .map_err(|e| err("DB_ERROR", &e.to_string()))?;
        }
    }

    Ok(None)
}

/* ---------- REVERT ---------- */

pub fn revert(job: JobRequest) -> Result<Option<Value>, BackendError> {
    let target_path = job.path.ok_or(err("INVALID_INPUT", "Target path missing"))?;
    let version = job.version.ok_or(err("INVALID_INPUT", "Version missing"))?;

    let conn = db::get_conn().map_err(|e| err("DB_ERROR", &e))?;
    let backup =
        db::get_backup_path(&conn, &target_path, version).map_err(|e| err("REVERT_FAILED", &e))?;

    let src = Path::new(&backup);
    let dest = Path::new(&target_path);

    if dest.exists() {
        fs::remove_file(dest).map_err(|e| err("REVERT_FAILED", &e.to_string()))?;
    }

    fs::copy(src, dest).map_err(|e| err("REVERT_FAILED", &e.to_string()))?;

    Ok(Some(json!({ "status": "reverted", "version": version })))
}

/* ---------- LIST ---------- */

pub fn list_all() -> Result<Option<Value>, BackendError> {
    let conn = db::get_conn().map_err(|e| err("DB_ERROR", &e))?;
    let mut stmt = conn.prepare(
        "SELECT id, file_name, ae_version, install_path, current_version
         FROM installed_plugins WHERE current_version > 0",
    ).map_err(|e| err("DB_ERROR", &e.to_string()))?;

    let list: Vec<Value> = stmt
        .query_map([], |r| {
            Ok(json!({
                "id": r.get::<_, i64>(0)?,
                "fileName": r.get::<_, String>(1)?,
                "aeVersion": r.get::<_, String>(2)?,
                "installPath": r.get::<_, String>(3)?,
                "currentVersion": r.get::<_, i32>(4)?,
            }))
        })
        .map_err(|e| err("DB_ERROR", &e.to_string()))?
        .flatten()
        .collect();

    Ok(Some(json!(list)))
}

/* ---------- DETECT AE ---------- */

pub fn detect_ae_versions() -> Result<Option<Value>, BackendError> {
    let mut versions = vec![];
    let base = Path::new("C:\\Program Files\\Adobe");

    if let Ok(entries) = fs::read_dir(base) {
        for e in entries.flatten() {
            let name = e.file_name().to_string_lossy().to_string();
            if name.contains("After Effects") {
                if let Some(v) = name.split_whitespace().last() {
                    if v.chars().all(|c| c.is_numeric()) {
                        versions.push(v.to_string());
                    }
                }
            }
        }
    }

    versions.sort_by(|a, b| b.cmp(a));
    Ok(Some(json!(versions)))
}

/* ---------- GET FOLDERS ---------- */

pub fn get_folders(job: JobRequest) -> Result<Option<Value>, BackendError> {
    let ae_ver = job.ae_version.ok_or(err("INVALID_INPUT", "AE version missing"))?;
    let ext = job.source.ok_or(err("INVALID_INPUT", "Extension missing"))?;

    let mut base = PathBuf::from(format!(
        "C:\\Program Files\\Adobe\\Adobe After Effects {}\\Support Files",
        ae_ver
    ));

    match ext.as_str() {
        "aex" => base.push("Plug-ins"),
        "ffx" => base.push("Presets"),
        _ => return Ok(Some(json!([]))),
    }

    if let Some(p) = job.path {
        base.push(p);
    }

    let mut folders = vec![];
    if let Ok(entries) = fs::read_dir(base) {
        for e in entries.flatten() {
            if e.path().is_dir() {
                folders.push(e.file_name().to_string_lossy().to_string());
            }
        }
    }

    folders.sort();
    Ok(Some(json!(folders)))
}
pub fn open_directory(job: JobRequest) -> Result<Option<Value>, BackendError> {
    let group = job.path.ok_or(err("INVALID_INPUT", "Group missing"))?;
    let ae_ver = job.ae_version.ok_or(err("INVALID_INPUT", "AE version missing"))?;
    
    let mut path = PathBuf::from(format!(
        "C:\\Program Files\\Adobe\\Adobe After Effects {}\\Support Files",
        ae_ver
    ));

    match group.as_str() {
        "scriptui" => path.push("Scripts\\ScriptUI Panels"),
        "plugin" => path.push("Plug-ins"),
        "preset" => path.push("Presets"),
        "extension" => {
            path = PathBuf::from("C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions");
        },
        _ => return Err(err("INVALID_PATH", "Unknown category")),
    }

    if !path.exists() {
        return Err(err("PATH_NOT_FOUND", &format!("Path missing: {:?}", path)));
    }

    // Windows specific command to open explorer
    Command::new("explorer")
        .arg(path.to_string_lossy().to_string())
        .spawn()
        .map_err(|e| err("OPEN_FAILED", &e.to_string()))?;

    Ok(None)
}

use rusqlite::{params, Connection};
use std::path::Path;

const DB_PATH: &str = "C:\\ProgramData\\AE-Toolbox\\data.db";
const VERSION_DIR: &str = "C:\\ProgramData\\AE-Toolbox\\versions";

pub fn get_conn() -> Result<Connection, String> {
    let conn = Connection::open(DB_PATH).map_err(|e| e.to_string())?;
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS installed_plugins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_name TEXT NOT NULL,
            ae_version TEXT NOT NULL,
            install_path TEXT NOT NULL UNIQUE,
            current_version INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS plugin_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plugin_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            stored_path TEXT NOT NULL,
            FOREIGN KEY(plugin_id) REFERENCES installed_plugins(id)
        );"
    ).map_err(|e| e.to_string())?;
    Ok(conn)
}

pub fn register_install(
    conn: &Connection,
    name: &str,
    ae_ver: &str,
    path: &str
) -> Result<(i64, i32), String> {
    let existing: Option<(i64, i32)> = conn.query_row(
        "SELECT id, current_version FROM installed_plugins WHERE install_path = ?1",
        params![path],
        |r| Ok((r.get(0)?, r.get(1)?))
    ).ok();

    match existing {
        Some((id, cv)) => Ok((id, cv + 1)),
        None => {
            conn.execute(
                "INSERT INTO installed_plugins (file_name, ae_version, install_path, current_version)
                 VALUES (?1, ?2, ?3, 0)",
                params![name, ae_ver, path]
            ).map_err(|e| e.to_string())?;
            Ok((conn.last_insert_rowid(), 1))
        }
    }
}

pub fn update_version(
    conn: &Connection,
    pid: i64,
    version: i32,
    backup_path: &str
) -> Result<(), String> {
    conn.execute(
        "INSERT INTO plugin_versions (plugin_id, version, stored_path)
         VALUES (?1, ?2, ?3)",
        params![pid, version, backup_path]
    ).map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE installed_plugins SET current_version = ?1 WHERE id = ?2",
        params![version, pid]
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_backup_path(
    conn: &Connection,
    install_path: &str,
    version: i32
) -> Result<String, String> {
    conn.query_row(
        "SELECT pv.stored_path FROM plugin_versions pv
         JOIN installed_plugins ip ON ip.id = pv.plugin_id
         WHERE ip.install_path = ?1 AND pv.version = ?2",
        params![install_path, version],
        |r| r.get(0)
    ).map_err(|_| "Backup version not found".into())
}

pub fn wipe_plugin(conn: &Connection, install_path: &str) -> Result<(), String> {
    let info: Option<(i64, String, String)> = conn.query_row(
        "SELECT id, file_name, ae_version FROM installed_plugins WHERE install_path = ?1",
        params![install_path],
        |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?))
    ).ok();

    if let Some((pid, name, ver)) = info {
        conn.execute("DELETE FROM plugin_versions WHERE plugin_id = ?1", params![pid])
            .map_err(|e| e.to_string())?;
        conn.execute("DELETE FROM installed_plugins WHERE id = ?1", params![pid])
            .map_err(|e| e.to_string())?;

        let backup_root = format!("{}/{}_{}", VERSION_DIR, name, ver);
        if Path::new(&backup_root).exists() {
            std::fs::remove_dir_all(&backup_root).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}


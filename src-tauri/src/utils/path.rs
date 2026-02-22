use std::path::{PathBuf};
use std::env;

/// Normalize path string.
pub fn normalize(path: &str) -> PathBuf {
    PathBuf::from(path)
}

/// Get Adobe base directory (Windows only for now).
pub fn adobe_base() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        PathBuf::from("C:\\Program Files\\Adobe")
    }

    #[cfg(target_os = "macos")]
    {
        PathBuf::from("/Applications/Adobe")
    }

    #[cfg(target_os = "linux")]
    {
        PathBuf::from("/opt/adobe")
    }
}

/// After Effects installation directory for version.
pub fn after_effects_dir(version: &str) -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        adobe_base()
            .join(format!("Adobe After Effects {}", version))
            .join("Support Files")
    }

    #[cfg(target_os = "macos")]
    {
        adobe_base()
            .join(format!("Adobe After Effects {}", version))
            .join("Support Files")
    }

    #[cfg(target_os = "linux")]
    {
        adobe_base()
            .join(format!("Adobe After Effects {}", version))
            .join("Support Files")
    }
}

/// ProgramData storage directory (for backups, DB later).
pub fn toolbox_data_dir() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        PathBuf::from("C:\\ProgramData\\AE-Toolbox")
    }

    #[cfg(target_os = "macos")]
    {
        let home = env::var("HOME").unwrap_or_default();
        PathBuf::from(home).join("Library/Application Support/AE-Toolbox")
    }

    #[cfg(target_os = "linux")]
    {
        PathBuf::from("/var/lib/ae-toolbox")
    }
}

/// Ensure toolbox directory exists.
pub fn ensure_toolbox_data_dir() -> std::io::Result<PathBuf> {
    let dir = toolbox_data_dir();
    if !dir.exists() {
        std::fs::create_dir_all(&dir)?;
    }
    Ok(dir)
}

/// Resolve plugin install path by type.
pub fn resolve_install_path(
    version: &str,
    group: &str,
) -> PathBuf {

    let base = after_effects_dir(version);

    match group {
        "scriptui" => base.join("Scripts").join("ScriptUI Panels"),
        "plugin" => base.join("Plug-ins"),
        "preset" => base.join("Presets"),
        "extension" => {
            #[cfg(target_os = "windows")]
            {
                PathBuf::from("C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions")
            }

            #[cfg(target_os = "macos")]
            {
                PathBuf::from("/Library/Application Support/Adobe/CEP/extensions")
            }

            #[cfg(target_os = "linux")]
            {
                base.join("Extensions")
            }
        }
        _ => base,
    }
}

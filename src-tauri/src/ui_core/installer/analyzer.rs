use std::path::{Path, PathBuf};
use crate::core::installer::types::DetectedAssetType;

pub fn analyze(path: &str) -> Result<DetectedAssetType, String> {
    let path = PathBuf::from(path);

    if !path.exists() {
        return Err("Path does not exist".into());
    }

    if path.is_file() {
        return analyze_file(&path);
    }

    analyze_folder(&path)
}

fn analyze_file(path: &Path) -> Result<DetectedAssetType, String> {
    match path.extension().and_then(|e| e.to_str()) {
        Some("aex") => Ok(DetectedAssetType::NativePlugin),
        Some("jsx") | Some("jsxbin") => Ok(DetectedAssetType::Script),
        Some("ffx") => Ok(DetectedAssetType::Preset),
        _ => Err("Unsupported file type".into()),
    }
}

fn analyze_folder(path: &Path) -> Result<DetectedAssetType, String> {
    if path.join("CSXS").join("manifest.xml").exists() {
        return Ok(DetectedAssetType::CepExtension);
    }

    if path.join("manifest.json").exists() {
        return Ok(DetectedAssetType::UxpExtension);
    }

    for entry in walkdir::WalkDir::new(path).max_depth(3) {
        let entry = entry.map_err(|e| e.to_string())?;
        if entry.path().extension().and_then(|e| e.to_str()) == Some("aex") {
            return Ok(DetectedAssetType::NativePlugin);
        }
    }

    Ok(DetectedAssetType::ScriptBundle)
}

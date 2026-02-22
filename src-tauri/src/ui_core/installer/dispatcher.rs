use engine_core::types::{InstallJob, AssetType};
use uuid::Uuid;

use crate::core::installer::types::DetectedAssetType;

pub fn create_job(
    id: Uuid,
    detected: DetectedAssetType,
    source: String,
    target: String,
) -> InstallJob {
    let asset_type = match detected {
        DetectedAssetType::NativePlugin => AssetType::NativePlugin,
        DetectedAssetType::Script => AssetType::Script,
        DetectedAssetType::ScriptBundle => AssetType::ScriptBundle,
        DetectedAssetType::CepExtension => AssetType::CepExtension,
        DetectedAssetType::UxpExtension => AssetType::UxpExtension,
        DetectedAssetType::Preset => AssetType::Preset,
    };

    InstallJob {
        id,
        asset_type,
        source_path: source,
        target_path: target,
    }
}

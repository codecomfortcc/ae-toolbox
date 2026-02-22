use serde::{Serialize, Deserialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AssetType {
    NativePlugin,
    Script,
    ScriptBundle,
    CepExtension,
    UxpExtension,
    Preset,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstallJob {
    pub id: Uuid,
    pub asset_type: AssetType,
    pub source_path: String,
    pub target_path: String,
}

use serde::Serialize;

#[derive(Debug, Serialize)]
pub enum DetectedAssetType {
    NativePlugin,
    Script,
    ScriptBundle,
    CepExtension,
    UxpExtension,
    Preset,
}

use serde::{ Deserialize, Serialize };

#[derive(Clone, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub enum JobKind {
    InstallFile,
    InstallZxp,
    InstallCcx,
    Delete,
    DeleteAll,
    Revert,
    List,
    DetectAE,
    GetFolders,
    OpenFolder,
}

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JobRequest {
    pub id: u64,
    pub kind: JobKind,
    pub source: Option<String>,
    pub path: Option<String>,

    pub ae_version: Option<String>,
    pub version: Option<i32>,
}

#[derive(Serialize)]
pub struct BackendError {
    pub code: String,
    pub message: String,
}

#[derive(Serialize)]
pub struct JobResponse {
    pub id: u64,
    pub success: bool,
    pub error: Option<BackendError>,
    pub data: Option<serde_json::Value>,
}

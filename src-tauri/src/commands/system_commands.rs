#[tauri::command]
pub async fn ping_backend() -> Result<String, String> {
    Ok("Backend alive".into())
}

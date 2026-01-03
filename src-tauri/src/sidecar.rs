use tauri::{AppHandle, State};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::{CommandEvent, CommandChild};
use std::sync::{Arc, Mutex};
use tokio::sync::oneshot;
use serde_json::{json, Value};
use std::collections::HashMap;

pub struct SidecarState {
    pub child: Arc<Mutex<Option<CommandChild>>>,
    pub callbacks: Arc<Mutex<HashMap<u64, oneshot::Sender<String>>>>,
}

#[tauri::command]
pub async fn dispatch_sidecar_job(
    app: AppHandle,
    state: State<'_, SidecarState>,
    kind: String,
    source: Option<String>,
    path: Option<String>,
    ae_version: Option<String>, // Renamed parameter to match internal logic
) -> Result<String, String> {
    let job_id = chrono::Utc::now().timestamp_millis() as u64;
    let (tx, rx) = oneshot::channel();

    {
        let mut child_guard = state.child.lock().unwrap();
        if child_guard.is_none() {
            let sidecar = app.shell().sidecar("installer-helper").map_err(|e| e.to_string())?;
            let (mut events, child) = sidecar.spawn().map_err(|e| e.to_string())?;
            
            let callbacks = state.callbacks.clone();
            tauri::async_runtime::spawn(async move {
                while let Some(event) = events.recv().await {
                    if let CommandEvent::Stdout(line) = event {
                        let msg = String::from_utf8_lossy(&line).to_string();
                        if !msg.trim().starts_with('{') { continue; }

                        if let Ok(json_res) = serde_json::from_str::<Value>(&msg) {
                            if let Some(id) = json_res["id"].as_u64() {
                                let mut cb_guard = callbacks.lock().unwrap();
                                if let Some(sender) = cb_guard.remove(&id) {
                                    let _ = sender.send(msg);
                                }
                            }
                        }
                    }
                }
            });
            *child_guard = Some(child);
        }
    }

    state.callbacks.lock().unwrap().insert(job_id, tx);

    // CRITICAL: Keys here must match the Rust sidecar's #[derive(Deserialize)]
    // sidecar uses camelCase for JobKind but needs snake_case for ae_version
    let job = json!({
        "id": job_id,
        "kind": kind,
        "source": source,
        "path": path,
        "aeVersion": ae_version 
    });
    println!("Job: {:?}", job);
    {
        let mut child_guard = state.child.lock().unwrap();
        if let Some(ref mut child) = *child_guard {
            let payload = format!("{}\n", job.to_string());
            child.write(payload.as_bytes()).map_err(|e| e.to_string())?;
        }
    }

    rx.await.map_err(|_| "Sidecar communication timed out".to_string())
}

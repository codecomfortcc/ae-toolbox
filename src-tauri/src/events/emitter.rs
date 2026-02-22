use tauri::AppHandle;
use engine_core::events::BackendEvent;

pub fn emit(app: &AppHandle, event: BackendEvent) {
    let _ = app.emit_all("backend-event", event);
}

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_state;
mod commands;
mod core;
mod privileged;
mod events;
mod utils;

use app_state::AppState;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let state = AppState::new(app.handle());
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::installer_commands::analyze_asset,
            commands::installer_commands::install_asset,
            commands::system_commands::ping_backend
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

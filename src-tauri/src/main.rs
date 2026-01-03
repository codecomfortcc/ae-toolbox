// Prevents additional console window on Windows in release, but keep it for dev
 #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod sidecar;

use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use sidecar::SidecarState; 

fn main() {
    println!("AE Toolbox v0.1.0");
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        // Initialize and Manage the Sidecar State
        .manage(SidecarState {
            child: Arc::new(Mutex::new(None)),
            callbacks: Arc::new(Mutex::new(HashMap::new())),
        })
        .invoke_handler(tauri::generate_handler![
            sidecar::dispatch_sidecar_job
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

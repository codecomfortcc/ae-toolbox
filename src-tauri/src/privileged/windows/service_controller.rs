use std::process::Command;

pub struct WindowsServiceController;

impl WindowsServiceController {

    pub fn start_service() -> Result<(), String> {
        let output = Command::new("sc")
            .args(["start", "AEInstallerService"])
            .output()
            .map_err(|e| e.to_string())?;

        if !output.status.success() {
            return Err("Failed to start service".into());
        }

        Ok(())
    }

    pub fn is_running() -> bool {
        if let Ok(output) = Command::new("sc")
            .args(["query", "AEInstallerService"])
            .output()
        {
            let text = String::from_utf8_lossy(&output.stdout);
            return text.contains("RUNNING");
        }

        false
    }
}

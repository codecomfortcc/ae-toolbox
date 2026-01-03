use crate::jobs::{BackendError, JobRequest};
use serde_json::{json, Value};
use std::process::Command;
use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

fn err(code: &str, msg: &str) -> BackendError {
    BackendError {
        code: code.into(),
        message: msg.into(),
    }
}

pub fn install_zxp(job: JobRequest) -> Result<Option<Value>, BackendError> {
    let src = job.source.ok_or(err("INVALID_INPUT", "ZXP source missing"))?;

    let mut exe = std::env::current_exe()
        .map_err(|e| err("EXEC_PATH_FAILED", &e.to_string()))?;
    exe.pop();
    exe.push("bin\\ExManCmd.exe");

    let output = Command::new(exe)
        .creation_flags(CREATE_NO_WINDOW)
        .arg("--install")
        .arg(&src)
        .output()
        .map_err(|e| err("ADOBE_CLI_FAILED", &e.to_string()))?;

    if output.status.success() {
        Ok(Some(json!({
            "stdout": String::from_utf8_lossy(&output.stdout)
        })))
    } else {
        Err(err(
            "ADOBE_INSTALL_FAILED",
            &String::from_utf8_lossy(&output.stderr),
        ))
    }
}

pub fn install_ccx(job: JobRequest) -> Result<Option<Value>, BackendError> {
    let src = job.source.ok_or(err("INVALID_INPUT", "CCX source missing"))?;

    let upia = "C:\\Program Files\\Common Files\\Adobe\\Adobe Desktop Common\\RemoteComponents\\UPI\\UnifiedPluginInstallerAgent\\UnifiedPluginInstallerAgent.exe";

    let output = Command::new(upia)
        .creation_flags(CREATE_NO_WINDOW)
        .arg("/install")
        .arg(&src)
        .output()
        .map_err(|e| err("ADOBE_CLI_FAILED", &e.to_string()))?;

    if output.status.success() {
        Ok(Some(json!({
            "info": "CCX installed successfully"
        })))
    } else {
        Err(err(
            "ADOBE_INSTALL_FAILED",
            &String::from_utf8_lossy(&output.stderr),
        ))
    }
}

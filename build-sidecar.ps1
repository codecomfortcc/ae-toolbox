# 1. Compile the sidecar logic
cd src-tauri/sidecar/installer-helper
cargo build --release

# 2. Move and rename it to match the GNU triple Tauri expects
$source = "target/release/installer-helper.exe"
$destination = "../installer-helper-x86_64-pc-windows-msvc.exe"

if (Test-Path $source) {
    Move-Item -Path $source -Destination $destination -Force
    Write-Host "✅ Sidecar built and renamed successfully." -ForegroundColor Green
} else {
    Write-Host "❌ Error: Sidecar binary not found." -ForegroundColor Red
    exit 1
}
cd ../../../

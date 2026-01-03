# 🎬 AE-Toolbox

AE-Toolbox is a **desktop utility for managing Adobe After Effects plugins**.  
It simplifies installing, tracking, and managing plugins across **multiple After Effects versions** — safely and reliably.

> ⚠️ **Alpha Release**  
> This project is in **early development**. Features may change and bugs are expected.

---

## 🚀 Current Version
**v0.5.1 (Alpha)**  
**Platform:** Windows

---

## ✨ Features

### 🔌 Plugin Installation
- Install After Effects plugins using:
  - ZXP
  - UXP
  - Custom plugin folders
- Automatically detects installed **After Effects versions**
- Installs plugins into correct AE directories

---

### 🔄 Version Tracking (Early)
- Tracks installed plugins per AE version
- Stores basic version and path information
- Foundation for future **revert / rollback support**

---

### 📂 Utility Tools
- Open plugin install directories
- Open backup / storage folders
- Quick access to After Effects paths

---

### 🧠 Local Database
- Uses SQLite for local storage
- Stores:
  - Plugin name
  - After Effects version
  - Install path
- Designed for future expansion

---

### ⚡ Performance & Stability
- Rust backend (Tauri v2)
- Async operations to avoid UI freezing
- Safer file handling to prevent corruption

---

## 🖥️ Installation

1. Go to **Releases**
2. Download the latest **`.msi` installer**
3. Run the installer (Admin permission may be required)
4. Launch **AE-Toolbox**

---

## ⚠️ Known Limitations (Alpha)

- Windows only
- Revert feature is **experimental**
- UI may refresh and briefly show incorrect states
- Limited validation for invalid plugin packages
- No automatic plugin updates yet

---

## 🧪 Intended Use
This alpha release is intended for:
- Early testers
- Technical users
- Feedback collection

⚠️ Avoid using on **critical production machines**.

---

## 🛣️ Roadmap (Planned)

- Stable plugin revert & rollback
- Plugin version history UI
- Better error logs and diagnostics
- Bulk install / uninstall
- UI polish & animations
- macOS support

---

## 🐞 Feedback & Issues
If you encounter bugs or unexpected behavior:
- Open an **Issue** on GitHub
- Include:
  - AE version
  - Plugin type (ZXP / UXP)
  - Steps to reproduce

---

## 🧱 Tech Stack
- **Tauri v2**
- **Rust** (backend)
- Modern frontend stack
- SQLite (local DB)

---

## 📜 License
MIT License

---

## 🙌 Disclaimer
AE-Toolbox is an **independent project** and is **not affiliated with Adobe**.

---

**Made for motion designers who hate manual plugin installs.**

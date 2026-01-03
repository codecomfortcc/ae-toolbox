import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Cpu,
  FolderDown,
  Trash2,
  Layers,
  Puzzle,
  Sliders,
  XCircle,
  RefreshCcw,
  FolderPlus,
  X,
  ChevronRight,
  ChevronLeft,
  Folder,
  Terminal,
  History,
  CloudUpload,
  FileCheck,
  FolderOpen, // New icon for heading
} from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";

/* ---------------- Types ---------------- */
type InstalledPlugin = {
  id: number;
  fileName: string;
  aeVersion: string;
  installPath: string;
  currentVersion: number;
};

type Group = "scriptui" | "plugin" | "preset" | "extension" | "uxp";

export default function PluginInstaller() {
  const navigate = useNavigate();
  const [aeVersions, setAeVersions] = useState<string[]>([]);
  const [targetAE, setTargetAE] = useState("");
  const [installed, setInstalled] = useState<InstalledPlugin[]>([]);
  const [expanded, setExpanded] = useState<Group | null>("scriptui");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Modal States
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<string | null>(null);
  const [currentPathStack, setCurrentPathStack] = useState<string[]>([]);
  const [foldersAtCurrentLevel, setFoldersAtCurrentLevel] = useState<string[]>([]);
  const [newSubFolderName, setNewSubFolderName] = useState("");

  // Track selected version for revert per plugin path
  const [selectedVersions, setSelectedVersions] = useState<Record<string, number>>({});

  /* ---------------- Logging System ---------------- */
  const log = (msg: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(
      `%c[DEBUG ${timestamp}] ${msg}`,
      "color: #a855f7; font-weight: bold",
      data || ""
    );
  };

  /* ---------------- Sidecar Bridge Logic ---------------- */
  const runSidecarJob = async (
    kind: string,
    source?: string | null,
    path?: string | null,
    ae_version?: string | null,
    version?: number | null 
  ) => {
    log(`Dispatching Job: ${kind}`, { source, path, ae_version, version });
    try {
      // CRITICAL: Parameter key is aeVersion (camelCase) to match backend struct
      const rawResponse = await invoke<string>("dispatch_sidecar_job", {
        kind,
        source: source || null,
        path: path || null,
        aeVersion: ae_version,
        version: version || null,
      });

      const res = JSON.parse(rawResponse);
      log(`Sidecar Response for ${kind}:`, res);

      if (!res.success) {
        const errMsg = res.error?.message || res.message || "Unknown Engine Error";
        log(`Sidecar Failure: ${errMsg}`);
        throw new Error(errMsg);
      }
      
      // Some actions like openFolder or delete return null data
      return res.data === null ? true : res.data;
    } catch (err: any) {
      log(`Execution Error in ${kind}:`, err);
      if (
        err.message?.toLowerCase().includes("permission") ||
        err.message?.toLowerCase().includes("access")
      ) {
        toast.error("ADMIN REQUIRED: Restart app as Administrator");
      } else {
        toast.error(err.message || "Operation failed");
      }
      return null;
    }
  };

  const refreshInstalled = async () => {
    log("Refreshing installed asset list...");
    const list = await runSidecarJob("list");
    if (list && Array.isArray(list)) {
      setInstalled(list);
      
      // Sync selected versions state with current versions
      const initialVersions: Record<string, number> = {};
      list.forEach((p) => {
        initialVersions[p.installPath] = p.currentVersion;
      });
      setSelectedVersions(initialVersions);
      
      log(`Loaded ${list.length} assets.`);
    }
  };

  /* ---------------- Installation Flow ---------------- */
  const startInstallFlow = useCallback(
    async (filePath: string) => {
      log(`Flow started for: ${filePath}`);
      if (!targetAE) {
        log("Aborted: No Target AE selected.");
        toast.info("Please select an After Effects version first");
        return;
      }

      const ext = filePath.split(".").pop()?.toLowerCase() || "";
      log(`Detected ext: .${ext}`);
      setPendingFile(filePath);

      if (ext === "jsx" || ext === "jsxbin") {
        await handleAction("installFile", { filePath });
      } else if (ext === "aex" || ext === "ffx") {
        log("Opening path picker for AEX/FFX");
        setCurrentPathStack([]);
        setShowFolderModal(true);
      } else if (ext === "zxp") {
        await handleAction("installZxp", { filePath });
      } else if (ext === "ccx") {
        await handleAction("installCcx", { filePath });
      } else {
        log(`Rejected: .${ext} is not supported.`);
        toast.error(`.${ext} files are not supported`);
      }
    },
    [targetAE]
  );

  /* ---------------- Global Listeners ---------------- */
  useEffect(() => {
    log("PluginInstaller Mounted. Setting up listeners.");
    let unlisten: UnlistenFn[] = [];

    const setup = async () => {
      unlisten.push(
        await listen("tauri://drag-enter", () => {
          setIsDragging(true);
          log("Drag entered window");
        })
      );
      unlisten.push(
        await listen("tauri://drag-leave", () => {
          setIsDragging(false);
          log("Drag left window");
        })
      );
      unlisten.push(
        await listen("tauri://drag-drop", (event: any) => {
          setIsDragging(false);
          const paths = (event.payload as any)?.paths ?? event.payload;
          log("File dropped:", paths);
          if (Array.isArray(paths) && paths[0]) startInstallFlow(paths[0]);
        })
      );
    };

    setup();

    const initApp = async () => {
      setIsProcessing(true);
      setStatusMessage("Detecting Environments...");
      const response = await runSidecarJob("detectAE");
      if (response && Array.isArray(response)) {
        setAeVersions(response);
        if (!targetAE && response.length > 0) setTargetAE(response[0]);
      }
      await refreshInstalled();
      setIsProcessing(false);
    };
    initApp();

    return () => {
      log("Unmounting Installer.");
      unlisten.forEach((fn) => fn());
    };
  }, [startInstallFlow]);

  /* ---------------- Actions ---------------- */
  const handleAction = async (
    kind: string,
    args: { filePath?: string; path?: string; version?: number }
  ) => {
    // We don't want a full processing screen for opening a folder
    if (kind !== "openFolder") {
        setIsProcessing(true);
        setStatusMessage(`Running ${kind}...`);
    }
    
    log(`Executing: ${kind}`, args);
    
    const result = await runSidecarJob(
      kind,
      args.filePath || args.path,
      args.path,
      targetAE,
      args.version
    );

    if (result) {
      if (kind !== "openFolder") {
          const actionName = 
            kind === "revert" ? "Revert" : 
            kind === "delete" ? "Deletion" : 
            kind === "deleteAll" ? "Full Cleanup" : "Installation";
            
          toast.success(`${actionName} successful`);
          await refreshInstalled(); 
      }
    }
    setIsProcessing(false);
  };

  useEffect(() => {
    if (showFolderModal && targetAE) {
      const ext = pendingFile?.split(".").pop()?.toLowerCase() || "";
      runSidecarJob(
        "getFolders",
        ext,
        currentPathStack.join("\\"),
        targetAE
      ).then((f) => setFoldersAtCurrentLevel(f || []));
    }
  }, [currentPathStack, showFolderModal, pendingFile, targetAE]);

  const groupOf = (file: string | undefined): Group => {
    if (!file) return "scriptui";
    const lower = file.toLowerCase();
    if (lower.endsWith(".ffx")) return "preset";
    if (lower.endsWith(".aex")) return "plugin";
    if (lower.endsWith(".zxp")) return "extension";
    if (lower.endsWith(".ccx")) return "uxp";
    return "scriptui";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans select-none overflow-hidden">
      {/* 1. TOP NAV */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-zinc-600 hover:text-white transition-all uppercase text-[10px] font-black group"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          Dashboard
        </button>
        <div className="flex items-center gap-3">
          <Terminal className="text-purple-500" size={18} />
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Plugin Engine v2.1
          </h1>
        </div>
      </div>

      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">
            Install AE PLUGINS
          </h2>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2">
            Automated Adobe Asset Handler
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <select
            value={targetAE}
            onChange={(e) => setTargetAE(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold uppercase outline-none focus:ring-2 ring-purple-500"
          >
            {aeVersions.map((v) => (
              <option key={v} value={v}>
                After Effects {v}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 h-[60vh] ">
        <ScrollArea className="col-span-4 space-y-3 pr-2 h-[60vh]">
          {/* 2. INVENTORY */}
          {(
            ["scriptui", "plugin", "preset", "extension", "uxp"] as Group[]
          ).map((g) => {
            const Icon =
              g === "scriptui"
                ? Layers
                : g === "plugin"
                ? Puzzle
                : g === "preset"
                ? Sliders
                : g === "extension"
                ? Puzzle
                : Cpu;
            const items = installed.filter((p) => groupOf(p.fileName) === g);
            return (
              <div
                key={g}
                className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-md mb-4"
              >
                {/* Header Container */}
                <div className={`w-full flex items-center justify-between p-5 transition-all ${
                    expanded === g ? "bg-zinc-800/40" : "hover:bg-zinc-800/10"
                }`}>
                  <button
                    onClick={() => setExpanded(expanded === g ? null : g)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <Icon
                      size={16}
                      className={
                        expanded === g ? "text-purple-400" : "text-zinc-600"
                      }
                    />
                    <span className="text-[11px] font-black uppercase">
                      {g === "scriptui"
                        ? "Scripts"
                        : g === "uxp"
                        ? "UXP (CCX)"
                        : g + "s"}
                    </span>
                    <span className="text-[9px] font-black bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-zinc-500">
                      {items.length}
                    </span>
                  </button>

                  {/* FOLDER OPEN ICON BUTTON */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent accordion from opening/closing
                      handleAction("openFolder", { path: g });
                    }}
                    className="p-2 text-zinc-600 hover:text-purple-400 transition-colors bg-zinc-950/50 rounded-lg border border-zinc-800/50"
                    title={`Open ${g} folder in Explorer`}
                  >
                    <FolderOpen size={14} />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {expanded === g && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-1.5 pt-2 border-t border-zinc-800/50">
                        {items.length === 0 && (
                            <p className="text-[9px] text-zinc-700 font-bold uppercase p-4 text-center">No items found</p>
                        )}
                        {items.map((p) => (
                          <div
                            key={p.installPath}
                            className="flex flex-col bg-black/40 border border-zinc-800/50 rounded-xl p-3 group/item space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold truncate pr-2 text-zinc-300">
                                  {p.fileName}
                                </p>
                                <p className="text-[8px] text-zinc-700 font-black uppercase">
                                  AE {p.aeVersion} • v{p.currentVersion}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                                <button
                                  onClick={() =>
                                    handleAction("revert", {
                                      path: p.installPath,
                                      version: selectedVersions[p.installPath],
                                    })
                                  }
                                  className="p-1.5 text-zinc-600 hover:text-blue-400"
                                  title="Revert to selected version"
                                >
                                  <History size={13} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction("delete", {
                                      path: p.installPath,
                                    })
                                  }
                                  className="p-1.5 text-zinc-600 hover:text-red-400"
                                  title="Delete current file"
                                >
                                  <Trash2 size={13} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction("deleteAll", {
                                      path: p.installPath,
                                    })
                                  }
                                  className="p-1.5 text-zinc-600 hover:text-red-600"
                                  title="Delete everything"
                                >
                                  <XCircle size={13} />
                                </button>
                              </div>
                            </div>

                            {/* VERSION SELECTOR */}
                            <div className="flex items-center justify-between bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/30">
                              <span className="text-[8px] font-black text-zinc-600 uppercase">
                                Version History
                              </span>
                              <select
                                value={selectedVersions[p.installPath] || p.currentVersion}
                                onChange={(e) =>
                                  setSelectedVersions({
                                    ...selectedVersions,
                                    [p.installPath]: parseInt(e.target.value),
                                  })
                                }
                                className="bg-transparent text-[10px] font-black text-purple-400 outline-none cursor-pointer"
                              >
                                {Array.from(
                                  { length: p.currentVersion },
                                  (_, i) => i + 1
                                )
                                  .reverse()
                                  .map((v) => (
                                    <option
                                      key={v}
                                      value={v}
                                      className="bg-zinc-900 text-white"
                                    >
                                      Version {v} {v === p.currentVersion ? "(Latest)" : ""}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </ScrollArea>

        {/* 3. DROPZONE */}
        <div className="col-span-8 relative">
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-purple-600/20 border-4 border-dashed border-purple-500 rounded-[3.5rem] flex items-center justify-center pointer-events-none backdrop-blur-sm"
              >
                <div className="flex flex-col items-center gap-4">
                  <CloudUpload
                    size={48}
                    className="text-white animate-bounce"
                  />
                  <span className="text-xl font-black uppercase italic tracking-widest text-purple-400">
                    Release to Deploy
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            onClick={() =>
              open({
                multiple: false,
                filters: [
                  {
                    name: "Adobe Files",
                    extensions: ["jsx", "jsxbin", "aex", "ffx", "zxp", "ccx"],
                  },
                ],
              }).then((f) => {
                if (typeof f === "string") startInstallFlow(f);
              })
            }
            whileHover={{ scale: 1.005 }}
            className="h-full border-2 border-dashed border-zinc-900 rounded-[3.5rem] flex flex-col items-center justify-center cursor-pointer group hover:border-zinc-700 transition-all"
          >
            <div className="p-12 rounded-full border border-zinc-900 mb-6 bg-zinc-950/30 group-hover:bg-purple-500/5 transition-all">
              <FolderDown className="w-16 h-16 text-zinc-800 group-hover:text-purple-500 transition-colors" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-300">
              Deploy Asset
            </h3>
            <p className="text-[10px] text-zinc-600 font-bold uppercase mt-2 tracking-[0.2em]">
              Drop files or click to browse system
            </p>
          </motion.div>
        </div>
      </div>

      {/* 4. FOLDER MODAL */}
      <AnimatePresence>
        {showFolderModal && (
          <div className="fixed inset-0 z-150 bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setShowFolderModal(false)}
                className="absolute top-8 right-8 text-zinc-600 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-black uppercase italic flex items-center gap-3 mb-6">
                <FolderPlus className="text-purple-500" size={24} /> Set
                Destination
              </h2>

              <div className="flex items-center gap-2 mb-4 overflow-x-auto py-2 scrollbar-hide">
                <button
                  onClick={() => setCurrentPathStack([])}
                  className="text-[9px] font-black uppercase text-purple-400"
                >
                  ROOT
                </button>
                {currentPathStack.map((name, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <ChevronRight size={10} className="text-zinc-700" />
                    <span className="text-[9px] font-black uppercase text-zinc-300">
                      {name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="max-h-60 overflow-y-auto mb-8 bg-black/40 rounded-3xl border border-zinc-800 p-2 custom-scrollbar">
                {foldersAtCurrentLevel.map((f) => (
                  <button
                    key={f}
                    onClick={() =>
                      setCurrentPathStack([...currentPathStack, f])
                    }
                    className="w-full text-left p-4 text-[11px] border-b border-zinc-800/20 hover:bg-purple-500/10 rounded-2xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Folder
                        size={14}
                        className="text-zinc-700 group-hover:text-purple-500 transition-colors"
                      />
                      <span className="font-bold text-zinc-500 group-hover:text-zinc-200 uppercase">
                        {f}
                      </span>
                    </div>
                    <ChevronRight size={12} className="text-zinc-800" />
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="SUBFOLDER..."
                value={newSubFolderName}
                onChange={(e) =>
                  setNewSubFolderName(e.target.value.toUpperCase())
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-[10px] outline-none focus:border-purple-500 font-black tracking-widest mb-4"
              />
              <button
                onClick={() => {
                  const path = [...currentPathStack, newSubFolderName]
                    .filter(Boolean)
                    .join("\\");
                  handleAction("installFile", { filePath: pendingFile!, path });
                  setShowFolderModal(false);
                }}
                className="w-full bg-purple-600 py-5 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20"
              >
                <FileCheck size={14} /> Finalize Installation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. PROCESSING */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <RefreshCcw
              className="animate-spin text-purple-500 mb-6"
              size={64}
            />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Engine Busy
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
              {statusMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

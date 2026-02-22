import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";
import {
  Trash2,
  Edit3,
  Copy,
  RefreshCw,
  FolderPlus,
  FilePlus,
  Film,
  Scissors,
  ClipboardPaste,
  ExternalLink,
  MonitorPlay,
  Palette,
  Check,
  Layers,
} from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { toast } from "sonner"; // Assuming you have 'sonner' or use 'console.log'

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#71717a",
];

export default function ProjectExplorerContextMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    contextTarget,
    clearContextTarget,
    createFolder,
    renameFile, // Ensure these exist in your store
    deleteFile, // Ensure these exist in your store
    copyFiles, // Ensure these exist in your store
    pasteFiles, // Ensure these exist in your store
    setFolderColor,
    runPowerLook,
    files,
    currentPath,
    clipboard, // Access clipboard state
  } = useProjectStore();

  // --- RESOLVE ACTIVE FILE ---
  const parentId = currentPath[currentPath.length - 1].id;
  const currentFiles = files[parentId] || [];

  const activeFile =
    contextTarget?.type === "file"
      ? currentFiles.find((f) => f.id === contextTarget.fileId)
      : null;

  // --- HANDLERS ---
  const handleRename = () => {
    if (!activeFile) return;
    const newName = prompt("Rename item:", activeFile.name);
    if (newName && newName !== activeFile.name) {
      renameFile(activeFile.id, newName);
    }
  };

  const handleDelete = () => {
    if (!activeFile) return;
    if (confirm(`Are you sure you want to delete "${activeFile.name}"?`)) {
      deleteFile(activeFile.id);
      toast.success("Item deleted");
    }
  };

  const handleCopyPath = () => {
    if (!activeFile) return;
    // Mock path generation
    const path = `D:/Projects/${activeFile.name}`;
    navigator.clipboard.writeText(path);
    toast.success("Path copied to clipboard");
  };

  return (
    <ContextMenu
      onOpenChange={(open) => !open && setTimeout(clearContextTarget, 100)}
    >
      <ContextMenuTrigger className="w-full h-full block">
        {children}
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64 bg-card/95 backdrop-blur-xl  text-foreground animate-in fade-in zoom-in-95 duration-100">
        {/* ==============================
            SCENARIO 1: EMPTY SPACE
           ============================== */}
        {contextTarget?.type === "project" && (
          <>
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>
                <FilePlus className="mr-2 h-4 w-4" /> New
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48 bg-[#09090b] border-white/10">
                <ContextMenuItem onClick={createFolder}>
                  <FolderPlus className="mr-2 h-4 w-4" /> Folder
                  <ContextMenuShortcut>Ctrl+N</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  <Film className="mr-2 h-4 w-4" /> Composition
                </ContextMenuItem>
                <ContextMenuItem>
                  <Layers className="mr-2 h-4 w-4" /> Solid
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>

            <ContextMenuSeparator className="bg-white/10" />

            <ContextMenuItem
              inset
              disabled={!clipboard}
              onClick={() => pasteFiles(parentId)}
            >
              <ClipboardPaste className="mr-2 h-4 w-4" /> Paste
              <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuItem inset onClick={runPowerLook}>
              <RefreshCw className="mr-2 h-4 w-4 text-yellow-500" /> Power Look
              Scan
            </ContextMenuItem>

            <ContextMenuSeparator className="bg-white/10" />

            <ContextMenuItem inset>
              <ExternalLink className="mr-2 h-4 w-4" /> Reveal in Explorer
            </ContextMenuItem>
          </>
        )}

        {/* ==============================
            SCENARIO 2: FILE / FOLDER
           ============================== */}
        {contextTarget?.type === "file" && activeFile && (
          <>
            {/* AE SPECIFIC ACTIONS */}
            {activeFile.type !== "folder" && (
              <>
                <ContextMenuItem
                  inset
                  className="text-purple-400 focus:text-purple-400 focus:bg-purple-500/10"
                >
                  <MonitorPlay className="mr-2 h-4 w-4" /> Open in AE
                </ContextMenuItem>
                <ContextMenuItem inset>
                  <Layers className="mr-2 h-4 w-4" /> Create Proxy
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-white/10" />
              </>
            )}

            {/* STANDARD FILE OPS */}
            <ContextMenuItem inset onClick={handleRename}>
              <Edit3 className="mr-2 h-4 w-4" /> Rename
              <ContextMenuShortcut>F2</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuItem inset onClick={handleCopyPath}>
              <Copy className="mr-2 h-4 w-4" /> Copy Path
            </ContextMenuItem>

            <ContextMenuSeparator className="bg-white/10" />

            {/* CLIPBOARD OPS */}
            <ContextMenuItem
              inset
              onClick={() => copyFiles([activeFile.id], "copy")}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy
              <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuItem
              inset
              onClick={() => copyFiles([activeFile.id], "cut")}
            >
              <Scissors className="mr-2 h-4 w-4" /> Cut
              <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuItem inset>
              <Layers className="mr-2 h-4 w-4" /> Duplicate
              <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
            </ContextMenuItem>

            {/* FOLDER COLOR PICKER */}
            {activeFile.type === "folder" && (
              <>
                <ContextMenuSeparator className="bg-white/10" />
                <ContextMenuSub>
                  <ContextMenuSubTrigger inset>
                    <Palette className="mr-2 h-4 w-4" /> Color Label
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-52 p-2 bg-[#09090b] border-white/10">
                    <div className="grid grid-cols-4 gap-2">
                      {COLORS.map((c) => (
                        <div
                          key={c}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFolderColor(activeFile.id, c);
                          }}
                          className={`
                                 w-9 h-9 rounded-full border border-white/10 cursor-pointer 
                                 hover:scale-110 transition-transform flex items-center justify-center
                                 ${activeFile.color === c ? "ring-2 ring-white" : ""}
                              `}
                          style={{ backgroundColor: c }}
                        >
                          {activeFile.color === c && (
                            <Check
                              size={14}
                              className="text-black/50 drop-shadow-md"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </>
            )}

            <ContextMenuSeparator className="bg-white/10" />

            <ContextMenuItem
              inset
              className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
              <ContextMenuShortcut>Del</ContextMenuShortcut>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

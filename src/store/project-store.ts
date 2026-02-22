import { create } from "zustand";

// --- TYPES ---
export interface FileNode {
  id: string;
  parentId: string;
  name: string;
  type: "folder" | "aep" | "audio" | "video" | "image" | "document" | "other";
  color?: string;
  icon?: string;
  size?: string;
  lastSelectedId: string | null;

  dateModified?: string;
  fps?: string;
  duration?: string;
  resolution?: string;
  allowedExtensions?: string[];
}

export interface Project {
  id: string;
  name: string;
  path: string;
  lastOpened: string;
}

interface ProjectState {
  // --- APP STATE ---
  currentScreen: "welcome" | "editor";
  activeProject: Project | null;
  recentProjects: Project[];

  currentPath: { id: string; name: string }[];
  files: Record<string, FileNode[]>;
  selectedFileIds: string[];
  clipboard: { ids: string[]; op: "copy" | "cut" } | null;
  viewMode: "grid" | "list";
  visibleColumns: Record<string, { name: string; visible: boolean }>;
  propertiesPanelOpen: boolean;
  activeFileId: string | null;

  powerLookPath: string;
  isPowerLookScanning: boolean;
  platform: string;
  searchQuery: string;
  isDraggingGlobal: boolean;
  automationPanelFolderId: string | null;
  contextTarget: {
    type: "file" | "project";
    fileId?: string;
  } | null;

  setContextTarget: (target: {
    type: "file" | "project";
    fileId?: string;
  }) => void;

  clearContextTarget: () => void;
  renameFile: (id: string, name: string) => void;
  deleteFile: (id: string) => void;
  copyFiles: (ids: string[], op: "copy" | "cut") => void;
  pasteFiles: (targetFolderId: string) => void;
  // --- ACTIONS ---
  openProject: (project: Project) => void;
  createProject: (name: string, template: string) => void;
  closeProject: () => void;
  navigateUp: () => void;
  navigateDown: (id: string, name: string) => void;
  toggleSelection: (id: string, multi: boolean) => void;
  selectAll: () => void;
  createFolder: () => void;
  togglePropertiesPanelOpen: () => void;
  setColumnVisibility: (colId: string, visible: boolean) => void;
  setPowerLookPath: (path: string) => void;
  runPowerLook: () => void;
  setViewMode: (mode: "grid" | "list") => void;
  setActiveFile: (id: string | null) => void;
  setFolderColor: (id: string, color: string) => void;
  setFolderIcon: (id: string, icon: string) => void;
  setSearchQuery: (query: string) => void;
  setDragging: (dragging: boolean) => void;
  handleGlobalDrop: (files: File[]) => void;
  validateDrop: (droppedFile: File, targetFile: FileNode) => boolean;
  setAutomationPanelFolderId: (id: string | null) => void;
}

const MOCK_FILES: Record<string, FileNode[]> = {
  root: [
    {
      id: "f1",
      parentId: "root",
      name: "01_AUDIO",
      type: "folder",
      color: "#ef4444",
      icon: "MdAudiotrack",
      size: "--",
      dateModified: "Today",
      lastSelectedId: null,
    },
    {
      id: "v1",
      parentId: "root",
      name: "Intro_Render.mp4",
      type: "video",
      size: "450MB",
      fps: "60",
      resolution: "4K",
      duration: "00:15",
      dateModified: "Yesterday",
      lastSelectedId: null,
    },
    {
      id: "i1",
      parentId: "root",
      name: "Logo_Transparent.png",
      type: "image",
      size: "2MB",
      resolution: "1080p",
      dateModified: "2 days ago",
      lastSelectedId: null,
    },
  ],
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentScreen: "welcome",
  activeProject: null,
  recentProjects: [
    {
      id: "p1",
      name: "Nike_Commercial",
      path: "D:/Work/Nike",
      lastOpened: "2 mins ago",
    },
    {
      id: "p2",
      name: "Youtube_Vlog_04",
      path: "D:/Personal/YT",
      lastOpened: "Yesterday",
    },
  ],
  platform: "windows",
  currentPath: [{ id: "root", name: "ROOT" }],
  files: MOCK_FILES,
  selectedFileIds: [],
  clipboard: null,

  viewMode: "grid",
  visibleColumns: {
    size: {
      name: "Size",
      visible: true,
    },
    type: {
      name: "Type",
      visible: true,
    },
    dateModified: {
      name: "Date Modified",
      visible: true,
    },
    fps: {
      name: "FPS",
      visible: true,
    },
    duration: {
      name: "Duration",
      visible: true,
    },
  },
  propertiesPanelOpen: true,
  activeFileId: null,
  contextTarget: null,
  powerLookPath: "",
  isPowerLookScanning: false,
  lastSelectedId: null,
  searchQuery: "",
  isDraggingGlobal: false,
  automationPanelFolderId: null,
  setContextTarget: (target) => set({ contextTarget: target }),

  clearContextTarget: () => set({ contextTarget: null }),

  renameFile: (id, name) =>
    set((state) => {
      const parentId = state.currentPath[state.currentPath.length - 1].id;

      return {
        files: {
          ...state.files,
          [parentId]: state.files[parentId].map((f) =>
            f.id === id ? { ...f, name } : f,
          ),
        },
      };
    }),

  deleteFile: (id) =>
    set((state) => {
      const parentId = state.currentPath[state.currentPath.length - 1].id;

      return {
        files: {
          ...state.files,
          [parentId]: state.files[parentId].filter((f) => f.id !== id),
        },
        selectedFileIds: state.selectedFileIds.filter((i) => i !== id),
      };
    }),

  copyFiles: (ids: string[], op: "copy" | "cut") =>
    set({ clipboard: { ids, op } }),

  pasteFiles: (targetFolderId: string) =>
    set((state) => {
      if (!state.clipboard) return state;

      const { ids, op } = state.clipboard;
      const currentFiles = Object.values(state.files).flat();
      const filesToCopy = currentFiles.filter((f) => ids.includes(f.id));

      const newFiles = filesToCopy.map((f: FileNode) => ({
        ...f,
        id: op === "copy" ? `${f.id}_copy_${Date.now()}` : f.id,
        parentId: targetFolderId,
      }));

      return {
        files: {
          ...state.files,
          [targetFolderId]: [
            ...(state.files[targetFolderId] || []),
            ...newFiles,
          ],
        },
        clipboard: op === "copy" ? state.clipboard : null,
      };
    }),

  togglePropertiesPanelOpen: () =>
    set((state) => ({ propertiesPanelOpen: !state.propertiesPanelOpen })),
  openProject: (project) =>
    set({
      activeProject: project,
      currentScreen: "editor",
      currentPath: [{ id: "root", name: "ROOT" }],
    }),
  createProject: (name, _template) => {
    const newProj = {
      id: `new_${Date.now()}`,
      name,
      path: "New Path",
      lastOpened: "Just now",
    };
    set((state) => ({
      activeProject: newProj,
      recentProjects: [newProj, ...state.recentProjects],
      currentScreen: "editor",
    }));
  },
  closeProject: () => set({ currentScreen: "welcome", activeProject: null }),

  navigateUp: () =>
    set((state) => {
      if (state.currentPath.length <= 1) return state;
      return {
        currentPath: state.currentPath.slice(0, -1),
        selectedFileIds: [],
      };
    }),
  navigateDown: (id, name) =>
    set((state) => ({
      currentPath: [...state.currentPath, { id, name }],
      selectedFileIds: [],
    })),

  toggleSelection: (id, multi) =>
    set((state) => ({
      selectedFileIds: multi
        ? state.selectedFileIds.includes(id)
          ? state.selectedFileIds.filter((i) => i !== id)
          : [...state.selectedFileIds, id]
        : [id],
      activeFileId: id,
    })),
  selectAll: () => {
    const parentId = get().currentPath[get().currentPath.length - 1].id;
    const ids = (get().files[parentId] || []).map((f) => f.id);
    set({ selectedFileIds: ids });
  },

  createFolder: () => {
    const parentId = get().currentPath[get().currentPath.length - 1].id;
    const newFolder: FileNode = {
      id: `f_${Date.now()}`,
      parentId,
      name: "New Folder",
      type: "folder",
      dateModified: "Just now",
      size: "--",
      lastSelectedId: null,
    };
    set((state) => ({
      files: {
        ...state.files,
        [parentId]: [...(state.files[parentId] || []), newFolder],
      },
      activeFileId: newFolder.id,
      selectedFileIds: [newFolder.id],
    }));
  },

  setColumnVisibility: (colId, visible) =>
    set((state) => ({
      visibleColumns: {
        ...state.visibleColumns,
        [colId]: { ...state.visibleColumns[colId], visible },
      },
    })),

  setPowerLookPath: (path) => set({ powerLookPath: path }),
  runPowerLook: () => {
    set({ isPowerLookScanning: true });
    setTimeout(() => set({ isPowerLookScanning: false }), 2000); // Mock scan
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveFile: (id) => set({ activeFileId: id }),
  setFolderColor: (id, color) =>
    set((state) => {
      const parentId = state.currentPath[state.currentPath.length - 1].id;
      const currentFiles = state.files[parentId] || [];
      const updatedFiles = currentFiles.map((f: any) =>
        f.id === id ? { ...f, color } : f,
      );
      return { files: { ...state.files, [parentId]: updatedFiles } };
    }),
  setFolderIcon: (id, icon) =>
    set((state) => {
      const parentId = state.currentPath[state.currentPath.length - 1].id;
      const currentFiles = state.files[parentId] || [];
      const updatedFiles = currentFiles.map((f: any) =>
        f.id === id ? { ...f, icon } : f,
      );
      return { files: { ...state.files, [parentId]: updatedFiles } };
    }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDragging: (dragging) => set({ isDraggingGlobal: dragging }),
  handleGlobalDrop: (files) => {
    console.log("Global Drop from store: ", files);
    // Implement logical handling if needed
  },
  validateDrop: (droppedFile: File, targetFile: FileNode) => {
    if (targetFile.type !== "folder") return false;
    if (!targetFile.allowedExtensions) return true;
    const ext = droppedFile.name.split(".").pop()?.toLowerCase() || "";
    return targetFile.allowedExtensions.includes(`.${ext}`);
  },
  setAutomationPanelFolderId: (id) => set({ automationPanelFolderId: id }),
}));

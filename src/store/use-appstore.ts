import { create } from "zustand";
import { persist } from "zustand/middleware";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  tag: string;
  avatarUrl: string | null;
  publishes: number;
  bio?: string;
  location?: string;
  website?: string;
}

export interface AppSettings {
  language: "en" | "es" | "fr" | "de" | "ja";
  autoUpdate: boolean;
  startOnBoot: boolean;
  minimizeToTray: boolean;

  // Appearance
  themeMode: "system" | "dark" | "light";
  accentColor: "violet" | "blue" | "green" | "orange" | "yellow" | "slate" | "rose";
  compactMode: boolean;
  
  updateChannel: "stable" | "beta" | "alpha";
  autoDownload: boolean; 
  notifyMajorOnly: boolean;
  developerMode: boolean;
  masterProjectLocation: string | null;
  projectTemplateJson: string; 
  enableDebugLogs: boolean;
  cefDebuggingPort: number; 
  bypassSignatures: boolean;
  installPathCache: string | null; 
}

interface AppState {
  isInitialized: boolean;
  targetAE: string;
  aeVersions: string[];
  isProcessing: boolean;
  statusMessage: string;
  
  profile: UserProfile;
  settings: AppSettings;

  init: () => Promise<void>;
  setTargetAE: (version: string) => void;
  setProcessing: (isProcessing: boolean, statusMessage?: string) => void;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  firstName: "Guest",
  lastName: "User",
  email: "",
  tag: "@guest",
  avatarUrl: null,
  publishes: 0,
};

const DEFAULT_SETTINGS: AppSettings = {
  language: "en",
  autoUpdate: true,
  startOnBoot: false,
  minimizeToTray: false,
  themeMode: "dark",
  accentColor: "violet",
  compactMode: false,
  updateChannel: "stable",
  developerMode: false,
  enableDebugLogs: false,
  installPathCache: null,
  autoDownload: true,
  notifyMajorOnly: true,
  cefDebuggingPort: 0,
  bypassSignatures: false,
  masterProjectLocation: null,
  projectTemplateJson: "",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      targetAE: "",
      aeVersions: [],
      isProcessing: false,
      statusMessage: "",
      profile: DEFAULT_PROFILE,
      settings: DEFAULT_SETTINGS,

      init: async () => {
        if (get().isInitialized) return;

        try {
          const versions = await invoke<string[]>("dispatch_sidecar_job", { kind: "detectAE" })
            .then((res: any) => (res?.success ? res.data : []));
          
          const dbProfile = await invoke<UserProfile>("get_user_profile").catch(() => null);
          const dbSettings = await invoke<AppSettings>("get_app_settings").catch(() => null);

          set((state) => ({
            aeVersions: versions || [],
            profile: dbProfile ? { ...state.profile, ...dbProfile } : state.profile,
            settings: dbSettings ? { ...state.settings, ...dbSettings } : state.settings,
            targetAE: state.targetAE || (versions && versions.length > 0 ? versions[0] : ""),
            isInitialized: true,
          }));
        } catch (error) {
          console.error("Failed to hydrate app state:", error);
        }
      },

      setTargetAE: (targetAE) => set({ targetAE }),
      setProcessing: (isProcessing, statusMessage = "Engine Busy") => set({ isProcessing, statusMessage }),

      updateProfile: async (partial) => {
        set((state) => ({ profile: { ...state.profile, ...partial } }));
        try {
          await invoke("update_user_profile", { profile: get().profile });
        } catch (err) {
          console.error("Failed to save profile", err);
          toast.error("Failed to save profile changes");
        }
      },

      updateSettings: async (partial) => {
        set((state) => ({ settings: { ...state.settings, ...partial } }));
        try {
          await invoke("update_app_settings", { settings: get().settings });
        } catch (err) {
          console.error("Failed to save settings", err);
          toast.error("Failed to save configuration");
        }
      },
    }),
    {
      name: "ae-toolbox-storage",
      partialize: (state) => ({
        settings: state.settings,
        targetAE: state.targetAE,
        profile: state.profile,
      }),
    }
  )
);

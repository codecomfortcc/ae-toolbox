// src/stores/plugin-store.ts

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export type AssetType =
  | "plugin"
  | "preset"
  | "scriptui"
  | "extension"
  | "uxp"

export type BackendAsset = {
  id: string
  name: string
  type: AssetType
  aeVersion: string
  installPath: string
  checksum: string
  currentVersion: number
  status: "healthy" | "missing" | "corrupted"
  installedAt: number
}

type PluginStore = {
  aeVersions: string[]
  selectedAE?: string
  inventory: Record<string, BackendAsset>
  expandedGroups: string[]
  isLoading: boolean
  error?: string
  applyInventorySnapshot: (assets: BackendAsset[]) => void
  applyInventoryDelta: (asset: BackendAsset) => void
  removeAsset: (assetId: string) => void
  setAEVersions: (versions: string[]) => void
  setSelectedAE: (ver: string) => void
  toggleGroup: (group: string) => void
  setLoading: (val: boolean) => void
  setError: (msg?: string) => void
  resetAll: () => void
}

export const usePluginStore = create<PluginStore>()(
  subscribeWithSelector((set) => ({
    aeVersions: [],
    selectedAE: undefined,
    inventory: {},
    expandedGroups: [],
    isLoading: false,
    error: undefined,

    applyInventorySnapshot: (assets) => {
      const map: Record<string, BackendAsset> = {}

      for (const asset of assets) {
        map[asset.id] = asset
      }

      set({
        inventory: map,
        isLoading: false,
      })
    },

    applyInventoryDelta: (asset) => {
      set((state) => ({
        inventory: {
          ...state.inventory,
          [asset.id]: asset,
        },
      }))
    },

    removeAsset: (assetId) =>
      set((state) => {
        const { [assetId]: _, ...rest } = state.inventory
        return { inventory: rest }
      }),

    setAEVersions: (versions) =>
      set({
        aeVersions: versions,
        selectedAE: versions[0],
      }),

    setSelectedAE: (ver) => set({ selectedAE: ver }),

    toggleGroup: (group) =>
      set((state) => ({
        expandedGroups: state.expandedGroups.includes(group)
          ? state.expandedGroups.filter((g) => g !== group)
          : [...state.expandedGroups, group],
      })),

    setLoading: (val) => set({ isLoading: val }),

    setError: (msg) => set({ error: msg }),

    resetAll: () =>
      set({
        inventory: {},
        aeVersions: [],
        selectedAE: undefined,
        expandedGroups: [],
        isLoading: false,
        error: undefined,
      }),
  }))
)

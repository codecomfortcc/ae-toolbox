// src/stores/installer-store.ts

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export type TaskStatus =
  | "queued"
  | "validating"
  | "preparing"
  | "installing"
  | "finalizing"
  | "success"
  | "error"
  | "cancelled"

export type BackendTask = {
  id: string
  kind: string
  source?: string
  aeVersion?: string
  targetPath?: string

  status: TaskStatus
  progress: number

  message?: string
  errorCode?: string
  errorMessage?: string

  startedAt?: number
  finishedAt?: number

  logs: string[]
}

type InstallerStore = {
  tasks: Record<string, BackendTask>
  activeTaskIds: string[]

  // derived state
  isProcessing: boolean

  // -------- BACKEND MIRROR METHODS --------

  applyTaskCreated: (task: BackendTask) => void

  applyTaskUpdated: (payload: {
    taskId: string
    status?: TaskStatus
    progress?: number
    message?: string
    log?: string
  }) => void

  applyTaskCompleted: (payload: {
    taskId: string
    success: boolean
    errorCode?: string
    errorMessage?: string
  }) => void

  removeTask: (taskId: string) => void
  clearFinishedTasks: () => void

  resetAll: () => void
}

export const useInstallerStore = create<InstallerStore>()(
  subscribeWithSelector((set) => ({
    tasks: {},
    activeTaskIds: [],
    isProcessing: false,

    applyTaskCreated: (task) => {
      set((state) => ({
        tasks: {
          ...state.tasks,
          [task.id]: task,
        },
        activeTaskIds: [...state.activeTaskIds, task.id],
        isProcessing: true,
      }))
    },

    applyTaskUpdated: ({ taskId, status, progress, message, log }) => {
      set((state) => {
        const existing = state.tasks[taskId]
        if (!existing) return state

        return {
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...existing,
              status: status ?? existing.status,
              progress: progress ?? existing.progress,
              message: message ?? existing.message,
              logs: log
                ? [...existing.logs, log]
                : existing.logs,
            },
          },
        }
      })
    },

    applyTaskCompleted: ({
      taskId,
      success,
      errorCode,
      errorMessage,
    }) => {
      set((state) => {
        const existing = state.tasks[taskId]
        if (!existing) return state

        const updated: BackendTask = {
          ...existing,
          status: success ? "success" : "error",
          progress: 1,
          errorCode,
          errorMessage,
          finishedAt: Date.now(),
        }

        const remainingActive = state.activeTaskIds.filter(
          (id) => id !== taskId
        )

        return {
          tasks: {
            ...state.tasks,
            [taskId]: updated,
          },
          activeTaskIds: remainingActive,
          isProcessing: remainingActive.length > 0,
        }
      })
    },

    removeTask: (taskId) => {
      set((state) => {
        const { [taskId]: _, ...rest } = state.tasks
        const remainingActive = state.activeTaskIds.filter(
          (id) => id !== taskId
        )

        return {
          tasks: rest,
          activeTaskIds: remainingActive,
          isProcessing: remainingActive.length > 0,
        }
      })
    },

    clearFinishedTasks: () => {
      set((state) => {
        const filtered: Record<string, BackendTask> = {}
        const active: string[] = []

        for (const id of Object.keys(state.tasks)) {
          const task = state.tasks[id]
          if (
            task.status !== "success" &&
            task.status !== "error" &&
            task.status !== "cancelled"
          ) {
            filtered[id] = task
            active.push(id)
          }
        }

        return {
          tasks: filtered,
          activeTaskIds: active,
          isProcessing: active.length > 0,
        }
      })
    },

    resetAll: () =>
      set({
        tasks: {},
        activeTaskIds: [],
        isProcessing: false,
      }),
  }))
)

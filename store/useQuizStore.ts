import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ModuleId } from "@/lib/modules"

interface QuizState {
  // Module progress (0-100)
  moduleProgress: Record<ModuleId, number>

  // Module scores (0-100)
  moduleScores: Record<ModuleId, number>

  // Time spent per module (in minutes)
  moduleTime: Record<ModuleId, number>

  // Answered questions per module
  answeredQuestions: Record<ModuleId, string[]>

  // User preferences
  reduceMotion: boolean

  // Actions
  setModuleProgress: (moduleId: ModuleId, progress: number) => void
  setModuleScore: (moduleId: ModuleId, score: number) => void
  addModuleTime: (moduleId: ModuleId, minutes: number) => void
  markQuestionAnswered: (moduleId: ModuleId, questionId: string) => void
  toggleReduceMotion: () => void

  // Getters
  getModuleProgress: (moduleId: ModuleId) => number
  getModuleScore: (moduleId: ModuleId) => number
  getTotalProgress: () => number
  getTotalScore: () => number
  getTotalTimeSpent: () => number
  isQuestionAnswered: (moduleId: ModuleId, questionId: string) => boolean
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      moduleProgress: {} as Record<ModuleId, number>,
      moduleScores: {} as Record<ModuleId, number>,
      moduleTime: {} as Record<ModuleId, number>,
      answeredQuestions: {} as Record<ModuleId, string[]>,
      reduceMotion: false,

      setModuleProgress: (moduleId, progress) =>
        set((state) => ({
          moduleProgress: { ...state.moduleProgress, [moduleId]: progress },
        })),

      setModuleScore: (moduleId, score) =>
        set((state) => ({
          moduleScores: { ...state.moduleScores, [moduleId]: Math.max(score, state.moduleScores[moduleId] || 0) },
        })),

      addModuleTime: (moduleId, minutes) =>
        set((state) => ({
          moduleTime: { ...state.moduleTime, [moduleId]: (state.moduleTime[moduleId] || 0) + minutes },
        })),

      markQuestionAnswered: (moduleId, questionId) =>
        set((state) => {
          const current = state.answeredQuestions[moduleId] || []
          if (!current.includes(questionId)) {
            return {
              answeredQuestions: {
                ...state.answeredQuestions,
                [moduleId]: [...current, questionId],
              },
            }
          }
          return state
        }),

      toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),

      getModuleProgress: (moduleId) => get().moduleProgress[moduleId] || 0,

      getModuleScore: (moduleId) => get().moduleScores[moduleId] || 0,

      getTotalProgress: () => {
        const { moduleProgress } = get()
        const modules = Object.keys(moduleProgress) as ModuleId[]
        if (modules.length === 0) return 0
        const total = modules.reduce((sum, moduleId) => sum + (moduleProgress[moduleId] || 0), 0)
        return Math.round(total / 3) // 3 modules total
      },

      getTotalScore: () => {
        const { moduleScores } = get()
        const modules = Object.keys(moduleScores) as ModuleId[]
        if (modules.length === 0) return 0
        const total = modules.reduce((sum, moduleId) => sum + (moduleScores[moduleId] || 0), 0)
        return Math.round(total / modules.length)
      },

      getTotalTimeSpent: () => {
        const { moduleTime } = get()
        return Object.values(moduleTime).reduce((sum, time) => sum + time, 0)
      },

      isQuestionAnswered: (moduleId, questionId) => {
        const answered = get().answeredQuestions[moduleId] || []
        return answered.includes(questionId)
      },
    }),
    {
      name: "grupo-d-ifts18-storage",
    },
  ),
)

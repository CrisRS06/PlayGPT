import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed'

export interface Lesson {
  id: string
  title: string
  module: string
  status: LessonStatus
  progress: number // 0-100
  completedAt?: Date
  lastAccessedAt?: Date
}

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  totalLessons: number
  completedLessons: number
  progress: number // 0-100
  status: LessonStatus
  order: number
}

interface LearningProgressState {
  // Lessons tracking
  lessons: Record<string, Lesson>

  // Modules tracking
  modules: Record<string, Module>

  // Current focus
  currentModuleId: string | null
  currentLessonId: string | null

  // Actions
  markLessonComplete: (lessonId: string) => void
  updateLessonProgress: (lessonId: string, progress: number) => void
  setCurrentLesson: (lessonId: string) => void
  setCurrentModule: (moduleId: string) => void
  getLessonById: (lessonId: string) => Lesson | undefined
  getModuleById: (moduleId: string) => Module | undefined
  getModuleProgress: (moduleId: string) => number
  initializeModules: (modules: Module[]) => void
}

// Default modules configuration
const DEFAULT_MODULES: Module[] = [
  {
    id: 'module-1-foundations',
    title: 'Módulo 1: Fundamentos',
    description: 'Probabilidad, valor esperado y sesgos cognitivos',
    icon: '🎲',
    totalLessons: 5,
    completedLessons: 0,
    progress: 0,
    status: 'available',
    order: 1
  },
  {
    id: 'module-2-sports-betting',
    title: 'Módulo 2: Apuestas Deportivas',
    description: 'Tipos de apuestas, odds y valor esperado',
    icon: '🏈',
    totalLessons: 6,
    completedLessons: 0,
    progress: 0,
    status: 'locked',
    order: 2
  },
  {
    id: 'module-3-bankroll',
    title: 'Módulo 3: Gestión de Bankroll',
    description: 'Kelly Criterion y gestión de dinero',
    icon: '💰',
    totalLessons: 4,
    completedLessons: 0,
    progress: 0,
    status: 'locked',
    order: 3
  },
  {
    id: 'module-4-psychology',
    title: 'Módulo 4: Psicología',
    description: 'Control emocional y toma de decisiones',
    icon: '🧠',
    totalLessons: 4,
    completedLessons: 0,
    progress: 0,
    status: 'locked',
    order: 4
  }
]

export const useLearningProgressStore = create<LearningProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      lessons: {},
      modules: DEFAULT_MODULES.reduce((acc, module) => {
        acc[module.id] = module
        return acc
      }, {} as Record<string, Module>),
      currentModuleId: 'module-1-foundations',
      currentLessonId: null,

      // Mark a lesson as complete
      markLessonComplete: (lessonId: string) => {
        const lesson = get().lessons[lessonId]
        if (!lesson) return

        const updatedLesson: Lesson = {
          ...lesson,
          status: 'completed',
          progress: 100,
          completedAt: new Date()
        }

        // Update lesson
        set(state => ({
          lessons: {
            ...state.lessons,
            [lessonId]: updatedLesson
          }
        }))

        // Update module progress
        const moduleId = lesson.module
        const module = get().modules[moduleId]
        if (module) {
          const moduleLessons = Object.values(get().lessons).filter(
            l => l.module === moduleId
          )
          const completedCount = moduleLessons.filter(
            l => l.status === 'completed'
          ).length
          const progress = (completedCount / module.totalLessons) * 100

          set(state => ({
            modules: {
              ...state.modules,
              [moduleId]: {
                ...module,
                completedLessons: completedCount,
                progress,
                status: progress === 100 ? 'completed' : 'in-progress'
              }
            }
          }))

          // Unlock next module if current is complete
          if (progress === 100) {
            const nextModule = Object.values(get().modules).find(
              m => m.order === module.order + 1
            )
            if (nextModule && nextModule.status === 'locked') {
              set(state => ({
                modules: {
                  ...state.modules,
                  [nextModule.id]: {
                    ...nextModule,
                    status: 'available'
                  }
                }
              }))
            }
          }
        }
      },

      // Update lesson progress
      updateLessonProgress: (lessonId: string, progress: number) => {
        const lesson = get().lessons[lessonId]
        if (!lesson) return

        set(state => ({
          lessons: {
            ...state.lessons,
            [lessonId]: {
              ...lesson,
              progress: Math.min(100, Math.max(0, progress)),
              status: progress > 0 ? 'in-progress' : lesson.status,
              lastAccessedAt: new Date()
            }
          }
        }))
      },

      // Set current lesson
      setCurrentLesson: (lessonId: string) => {
        set({ currentLessonId: lessonId })
      },

      // Set current module
      setCurrentModule: (moduleId: string) => {
        set({ currentModuleId: moduleId })
      },

      // Get lesson by ID
      getLessonById: (lessonId: string) => {
        return get().lessons[lessonId]
      },

      // Get module by ID
      getModuleById: (moduleId: string) => {
        return get().modules[moduleId]
      },

      // Get module progress
      getModuleProgress: (moduleId: string) => {
        const module = get().modules[moduleId]
        return module?.progress || 0
      },

      // Initialize modules (can be called from server data)
      initializeModules: (modules: Module[]) => {
        const modulesMap = modules.reduce((acc, module) => {
          acc[module.id] = module
          return acc
        }, {} as Record<string, Module>)

        set({ modules: modulesMap })
      }
    }),
    {
      name: 'learning-progress-storage',
    }
  )
)

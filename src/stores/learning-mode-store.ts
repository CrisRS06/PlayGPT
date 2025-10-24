import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LearningMode = 'free' | 'guided'

interface LearningModeState {
  mode: LearningMode
  showOnboarding: boolean
  onboardingCompleted: boolean

  // Mode control
  setMode: (mode: LearningMode) => void
  toggleMode: () => void

  // Onboarding control
  startOnboarding: () => void
  completeOnboarding: () => void
  skipOnboarding: () => void

  // Guided mode settings
  guidedSettings: {
    autoSuggestTopics: boolean
    showInlineQuizzes: boolean
    proactiveRecommendations: boolean
    trackProgress: boolean
  }
  updateGuidedSettings: (settings: Partial<LearningModeState['guidedSettings']>) => void
}

export const useLearningModeStore = create<LearningModeState>()(
  persist(
    (set, get) => ({
      mode: 'guided', // Default to guided for better educational experience
      showOnboarding: true,
      onboardingCompleted: false,

      guidedSettings: {
        autoSuggestTopics: true,
        showInlineQuizzes: true,
        proactiveRecommendations: true,
        trackProgress: true
      },

      setMode: (mode: LearningMode) => {
        set({ mode })
      },

      toggleMode: () => {
        const currentMode = get().mode
        const newMode = currentMode === 'free' ? 'guided' : 'free'
        set({ mode: newMode })
      },

      startOnboarding: () => {
        set({ showOnboarding: true })
      },

      completeOnboarding: () => {
        set({
          showOnboarding: false,
          onboardingCompleted: true
        })
      },

      skipOnboarding: () => {
        set({
          showOnboarding: false,
          onboardingCompleted: false
        })
      },

      updateGuidedSettings: (settings) => {
        set(state => ({
          guidedSettings: {
            ...state.guidedSettings,
            ...settings
          }
        }))
      }
    }),
    {
      name: 'learning-mode-storage',
    }
  )
)

// Helper function to get mode description
export function getModeDescription(mode: LearningMode): {
  title: string
  description: string
  features: string[]
} {
  switch (mode) {
    case 'guided':
      return {
        title: 'Modo Guiado',
        description: 'El asistente estructura activamente tu aprendizaje',
        features: [
          'Sugerencias personalizadas de temas',
          'Quizzes automáticos después de explicaciones',
          'Recomendaciones de conceptos a reforzar',
          'Seguimiento proactivo de progreso',
          'Notificaciones de hitos alcanzados'
        ]
      }
    case 'free':
      return {
        title: 'Modo Libre',
        description: 'Conversación tradicional a tu propio ritmo',
        features: [
          'Preguntas sin estructura predefinida',
          'Control total del flujo de aprendizaje',
          'Exploración libre de temas',
          'Sin interrupciones automáticas',
          'Ideal para consultas específicas'
        ]
      }
  }
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Conversation states for guided learning
 * Based on Duolingo/Khan Academy patterns with scaffolding
 */
export type ConversationState =
  | 'greeting' // Initial greeting
  | 'objective-setting' // What do you want to learn?
  | 'teaching' // Explaining concepts
  | 'checking-understanding' // Socratic questioning
  | 'practice' // Applying knowledge
  | 'assessment' // Mini quiz/checkpoint
  | 'feedback' // Results and next steps
  | 'completed' // Lesson complete

/**
 * Scaffolding levels (fading guidance over time)
 */
export type ScaffoldingLevel = 'high' | 'medium' | 'low'

/**
 * Question types for guided interactions
 */
export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-in-blank'
  | 'open-ended'
  | 'worked-example'

export interface GuidedStep {
  id: string
  state: ConversationState
  title: string
  description: string
  completed: boolean
  skipped: boolean
}

export interface GuidedSession {
  sessionId: string
  moduleId: string
  lessonId: string | null
  startedAt: Date
  currentStep: number
  steps: GuidedStep[]
  scaffoldingLevel: ScaffoldingLevel
  hintsUsed: number
  correctAnswers: number
  totalQuestions: number
}

interface GuidedLearningState {
  // Current session
  activeSession: GuidedSession | null

  // Conversation flow
  currentState: ConversationState
  conversationHistory: ConversationState[]

  // Scaffolding
  scaffoldingLevel: ScaffoldingLevel
  hintsAvailable: number
  hintsUsed: number

  // Progress in current lesson
  currentStepIndex: number
  totalSteps: number

  // User interaction tracking
  lastInteractionAt: Date | null
  questionsAsked: number
  correctAnswers: number

  // Actions
  startGuidedSession: (moduleId: string, lessonId?: string) => void
  endGuidedSession: () => void
  advanceToNextStep: () => void
  setConversationState: (state: ConversationState) => void
  updateScaffoldingLevel: (level: ScaffoldingLevel) => void
  useHint: () => void
  recordAnswer: (isCorrect: boolean) => void
  skipStep: () => void
  resetSession: () => void
}

/**
 * Default steps for a guided learning session
 */
function createDefaultSteps(moduleId: string): GuidedStep[] {
  return [
    {
      id: 'greeting',
      state: 'greeting',
      title: 'Bienvenida',
      description: 'Introducción al tema',
      completed: false,
      skipped: false,
    },
    {
      id: 'objective-setting',
      state: 'objective-setting',
      title: 'Establecer objetivos',
      description: '¿Qué quieres aprender hoy?',
      completed: false,
      skipped: false,
    },
    {
      id: 'teaching',
      state: 'teaching',
      title: 'Enseñanza',
      description: 'Explicación de conceptos clave',
      completed: false,
      skipped: false,
    },
    {
      id: 'checking-understanding',
      state: 'checking-understanding',
      title: 'Verificación',
      description: 'Comprobamos que comprendiste',
      completed: false,
      skipped: false,
    },
    {
      id: 'practice',
      state: 'practice',
      title: 'Práctica',
      description: 'Aplica lo que aprendiste',
      completed: false,
      skipped: false,
    },
    {
      id: 'assessment',
      state: 'assessment',
      title: 'Evaluación',
      description: 'Mini quiz de checkpoint',
      completed: false,
      skipped: false,
    },
    {
      id: 'feedback',
      state: 'feedback',
      title: 'Retroalimentación',
      description: 'Resultados y próximos pasos',
      completed: false,
      skipped: false,
    },
  ]
}

export const useGuidedLearningStore = create<GuidedLearningState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeSession: null,
      currentState: 'greeting',
      conversationHistory: [],
      scaffoldingLevel: 'high',
      hintsAvailable: 3,
      hintsUsed: 0,
      currentStepIndex: 0,
      totalSteps: 7,
      lastInteractionAt: null,
      questionsAsked: 0,
      correctAnswers: 0,

      // Start a new guided session
      startGuidedSession: (moduleId: string, lessonId?: string) => {
        const steps = createDefaultSteps(moduleId)
        const session: GuidedSession = {
          sessionId: `session-${Date.now()}`,
          moduleId,
          lessonId: lessonId || null,
          startedAt: new Date(),
          currentStep: 0,
          steps,
          scaffoldingLevel: 'high',
          hintsUsed: 0,
          correctAnswers: 0,
          totalQuestions: 0,
        }

        set({
          activeSession: session,
          currentState: 'greeting',
          conversationHistory: ['greeting'],
          scaffoldingLevel: 'high',
          hintsAvailable: 3,
          hintsUsed: 0,
          currentStepIndex: 0,
          totalSteps: steps.length,
          lastInteractionAt: new Date(),
          questionsAsked: 0,
          correctAnswers: 0,
        })
      },

      // End the current session
      endGuidedSession: () => {
        const session = get().activeSession
        if (!session) return

        set({
          activeSession: null,
          currentState: 'greeting',
          conversationHistory: [],
          currentStepIndex: 0,
        })
      },

      // Advance to next step
      advanceToNextStep: () => {
        const { currentStepIndex, totalSteps, activeSession } = get()
        if (!activeSession) return

        if (currentStepIndex < totalSteps - 1) {
          const newIndex = currentStepIndex + 1
          const newState = activeSession.steps[newIndex].state

          // Mark current step as completed
          const updatedSteps = [...activeSession.steps]
          updatedSteps[currentStepIndex].completed = true

          set({
            currentStepIndex: newIndex,
            currentState: newState,
            conversationHistory: [...get().conversationHistory, newState],
            activeSession: {
              ...activeSession,
              currentStep: newIndex,
              steps: updatedSteps,
            },
            lastInteractionAt: new Date(),
          })

          // Adaptive scaffolding: reduce help as user progresses
          if (newIndex === 3) {
            // After checking understanding, reduce to medium
            set({ scaffoldingLevel: 'medium' })
          } else if (newIndex === 5) {
            // During practice, reduce to low if doing well
            const { correctAnswers, questionsAsked } = get()
            if (questionsAsked > 0 && correctAnswers / questionsAsked >= 0.7) {
              set({ scaffoldingLevel: 'low' })
            }
          }
        } else {
          // Complete the session
          set({ currentState: 'completed' })
        }
      },

      // Set conversation state manually
      setConversationState: (state: ConversationState) => {
        set({
          currentState: state,
          conversationHistory: [...get().conversationHistory, state],
          lastInteractionAt: new Date(),
        })
      },

      // Update scaffolding level
      updateScaffoldingLevel: (level: ScaffoldingLevel) => {
        set({ scaffoldingLevel: level })

        // Adjust hints available based on level
        if (level === 'high') {
          set({ hintsAvailable: 3 })
        } else if (level === 'medium') {
          set({ hintsAvailable: 2 })
        } else {
          set({ hintsAvailable: 1 })
        }
      },

      // Use a hint
      useHint: () => {
        const { hintsAvailable, hintsUsed, activeSession } = get()
        if (hintsAvailable > 0) {
          set({
            hintsAvailable: hintsAvailable - 1,
            hintsUsed: hintsUsed + 1,
            activeSession: activeSession
              ? { ...activeSession, hintsUsed: activeSession.hintsUsed + 1 }
              : null,
          })
        }
      },

      // Record answer correctness
      recordAnswer: (isCorrect: boolean) => {
        const { questionsAsked, correctAnswers, activeSession } = get()
        set({
          questionsAsked: questionsAsked + 1,
          correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
          activeSession: activeSession
            ? {
                ...activeSession,
                totalQuestions: activeSession.totalQuestions + 1,
                correctAnswers: isCorrect
                  ? activeSession.correctAnswers + 1
                  : activeSession.correctAnswers,
              }
            : null,
        })
      },

      // Skip current step
      skipStep: () => {
        const { currentStepIndex, activeSession } = get()
        if (!activeSession) return

        // Mark step as skipped
        const updatedSteps = [...activeSession.steps]
        updatedSteps[currentStepIndex].skipped = true

        set({
          activeSession: {
            ...activeSession,
            steps: updatedSteps,
          },
        })

        // Advance to next step
        get().advanceToNextStep()
      },

      // Reset session (for debugging or restart)
      resetSession: () => {
        set({
          activeSession: null,
          currentState: 'greeting',
          conversationHistory: [],
          scaffoldingLevel: 'high',
          hintsAvailable: 3,
          hintsUsed: 0,
          currentStepIndex: 0,
          totalSteps: 7,
          lastInteractionAt: null,
          questionsAsked: 0,
          correctAnswers: 0,
        })
      },
    }),
    {
      name: 'guided-learning-storage',
    }
  )
)

/**
 * Helper to get scaffolding description
 */
export function getScaffoldingDescription(level: ScaffoldingLevel): string {
  switch (level) {
    case 'high':
      return 'Guía completa con ejemplos y explicaciones detalladas'
    case 'medium':
      return 'Guía moderada con pistas cuando sea necesario'
    case 'low':
      return 'Práctica independiente con mínima ayuda'
  }
}

/**
 * Helper to get state description
 */
export function getStateDescription(state: ConversationState): {
  title: string
  description: string
  userPrompt: string
} {
  switch (state) {
    case 'greeting':
      return {
        title: 'Bienvenida',
        description: 'Iniciando tu sesión de aprendizaje guiado',
        userPrompt: 'Hola, quiero aprender sobre este tema',
      }
    case 'objective-setting':
      return {
        title: 'Objetivos',
        description: 'Estableciendo qué aprenderás hoy',
        userPrompt: '¿Qué conceptos vamos a cubrir?',
      }
    case 'teaching':
      return {
        title: 'Enseñanza',
        description: 'Aprendiendo conceptos fundamentales',
        userPrompt: 'Explícame este concepto',
      }
    case 'checking-understanding':
      return {
        title: 'Verificación',
        description: 'Comprobando tu comprensión',
        userPrompt: '¿Puedes hacerme preguntas para verificar?',
      }
    case 'practice':
      return {
        title: 'Práctica',
        description: 'Aplicando lo aprendido',
        userPrompt: 'Dame un ejercicio práctico',
      }
    case 'assessment':
      return {
        title: 'Evaluación',
        description: 'Checkpoint de conocimiento',
        userPrompt: 'Estoy listo para la evaluación',
      }
    case 'feedback':
      return {
        title: 'Retroalimentación',
        description: 'Revisando tu progreso',
        userPrompt: '¿Cómo me fue?',
      }
    case 'completed':
      return {
        title: 'Completado',
        description: '¡Lección terminada!',
        userPrompt: '¿Qué sigue?',
      }
  }
}

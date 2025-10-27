"use client"

import { motion } from "framer-motion"
import { Play, StopCircle, SkipForward, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGuidedLearningStore, getStateDescription } from "@/stores/guided-learning-store"
import { useLearningProgressStore } from "@/stores/learning-progress-store"

interface GuidedSessionControlProps {
  onStartSession?: () => void
  onEndSession?: () => void
  onAdvanceStep?: () => void
}

export function GuidedSessionControl({
  onStartSession,
  onEndSession,
  onAdvanceStep,
}: GuidedSessionControlProps) {
  const {
    activeSession,
    currentState,
    currentStepIndex,
    totalSteps,
    advanceToNextStep,
    endGuidedSession,
    startGuidedSession,
    skipStep,
  } = useGuidedLearningStore()

  const { currentModuleId } = useLearningProgressStore()

  const handleStartSession = () => {
    if (currentModuleId) {
      startGuidedSession(currentModuleId)
      onStartSession?.()
    }
  }

  const handleEndSession = () => {
    endGuidedSession()
    onEndSession?.()
  }

  const handleAdvance = () => {
    advanceToNextStep()
    onAdvanceStep?.()
  }

  const handleSkip = () => {
    skipStep()
  }

  // If no active session, show start button
  if (!activeSession) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Modo Guiado Activado
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Comienza una sesión de aprendizaje estructurado. Te guiaré paso a paso
            a través de los conceptos clave.
          </p>
          <Button
            onClick={handleStartSession}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 h-12 px-8"
          >
            <Play className="w-5 h-5 mr-2" />
            Iniciar Sesión Guiada
          </Button>
        </div>
      </motion.div>
    )
  }

  // If session is active, show controls
  const stateInfo = getStateDescription(currentState)
  const isLastStep = currentStepIndex === totalSteps - 1
  const isCompleted = currentState === 'completed'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="my-4 p-4 rounded-lg bg-gray-50 border-2 border-gray-200"
    >
      <div className="flex items-start gap-4">
        {/* State info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {stateInfo.title}
            </span>
            <span className="text-xs text-gray-500">
              ({currentStepIndex + 1}/{totalSteps})
            </span>
          </div>
          <p className="text-sm text-gray-700">
            {stateInfo.description}
          </p>
          {!isCompleted && (
            <p className="text-xs text-gray-500 mt-2 italic">
              Sugerencia: "{stateInfo.userPrompt}"
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isCompleted && (
            <>
              <Button
                onClick={handleAdvance}
                size="sm"
                className="bg-primary hover:bg-primary/90 h-9"
              >
                {isLastStep ? (
                  <>
                    Finalizar
                    <StopCircle className="w-4 h-4 ml-1.5" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>

              <Button
                onClick={handleSkip}
                variant="ghost"
                size="sm"
                className="h-9 text-gray-600"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </>
          )}

          <Button
            onClick={handleEndSession}
            variant="ghost"
            size="sm"
            className="h-9 text-gray-600 hover:text-destructive hover:bg-destructive/10"
          >
            <StopCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg bg-green-50 border-2 border-green-200"
        >
          <p className="text-sm font-semibold text-green-900 mb-2">
            ¡Sesión Completada! 🎉
          </p>
          <p className="text-sm text-green-800 mb-3">
            Has completado todos los pasos de esta lección guiada.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => startGuidedSession(currentModuleId || 'module-1-foundations')}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Nueva Sesión
            </Button>
            <Button
              onClick={handleEndSession}
              variant="outline"
              size="sm"
            >
              Salir
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

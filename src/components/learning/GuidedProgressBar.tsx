"use client"

import { motion } from "framer-motion"
import { Check, Circle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGuidedLearningStore, getStateDescription } from "@/stores/guided-learning-store"

export function GuidedProgressBar() {
  const {
    activeSession,
    currentStepIndex,
    totalSteps,
    currentState,
  } = useGuidedLearningStore()

  // Don't show if no active session
  if (!activeSession) return null

  const steps = activeSession.steps
  const progress = ((currentStepIndex + 1) / totalSteps) * 100

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-gray-200 bg-white"
    >
      <div className="mx-auto max-w-4xl px-4 py-3">
        {/* Progress bar header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {getStateDescription(currentState).title}
            </h3>
            <p className="text-xs text-gray-600">
              Paso {currentStepIndex + 1} de {totalSteps}
            </p>
          </div>
          <div className="text-sm font-medium text-primary">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
          />
        </div>

        {/* Step indicators (mobile: horizontal scroll, desktop: all visible) */}
        <div className="mt-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max md:min-w-0 md:justify-between">
            {steps.map((step, index) => {
              const isCompleted = step.completed
              const isCurrent = index === currentStepIndex
              const isSkipped = step.skipped
              const isLocked = index > currentStepIndex

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center gap-1.5 flex-shrink-0 w-16",
                    "transition-opacity duration-200"
                  )}
                >
                  {/* Step circle */}
                  <div
                    className={cn(
                      "relative w-8 h-8 rounded-full flex items-center justify-center",
                      "border-2 transition-all duration-300",
                      isCompleted &&
                        "bg-primary border-primary text-white",
                      isCurrent &&
                        !isCompleted &&
                        "border-primary bg-primary/10 text-primary",
                      isSkipped &&
                        "border-gray-300 bg-gray-100 text-gray-400",
                      isLocked &&
                        !isSkipped &&
                        "border-gray-300 bg-gray-50 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Circle
                        className={cn(
                          "w-3 h-3",
                          isCurrent && "fill-current"
                        )}
                      />
                    )}

                    {/* Pulse animation for current step */}
                    {isCurrent && !isCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={cn(
                      "text-xs text-center leading-tight",
                      isCurrent && "font-semibold text-gray-900",
                      isCompleted && "text-gray-700",
                      isSkipped && "text-gray-400 line-through",
                      isLocked && "text-gray-400"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

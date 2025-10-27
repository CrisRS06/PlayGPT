"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGuidedLearningStore } from "@/stores/guided-learning-store"

interface GuidedHintSystemProps {
  hints: string[]
  onHintUsed?: () => void
}

export function GuidedHintSystem({ hints, onHintUsed }: GuidedHintSystemProps) {
  const [expandedHintIndex, setExpandedHintIndex] = useState<number | null>(null)
  const { hintsAvailable, hintsUsed, scaffoldingLevel, useHint } = useGuidedLearningStore()

  const handleRevealHint = (index: number) => {
    if (expandedHintIndex !== index && hintsAvailable > 0) {
      useHint()
      onHintUsed?.()
    }
    setExpandedHintIndex(expandedHintIndex === index ? null : index)
  }

  // Don't show hints in low scaffolding mode
  if (scaffoldingLevel === 'low') {
    return null
  }

  // Limit hints based on scaffolding level
  const availableHints = scaffoldingLevel === 'high' ? hints : hints.slice(0, 2)

  if (availableHints.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-4 p-4 rounded-lg bg-amber-50 border-2 border-amber-200"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-amber-600" />
        <span className="text-sm font-semibold text-amber-900">
          Pistas disponibles
        </span>
        <span className="text-xs text-amber-700 ml-auto">
          {hintsAvailable} {hintsAvailable === 1 ? 'pista restante' : 'pistas restantes'}
        </span>
      </div>

      <div className="space-y-2">
        {availableHints.map((hint, index) => {
          const isExpanded = expandedHintIndex === index
          const isRevealed = index < hintsUsed

          return (
            <div
              key={index}
              className={cn(
                "rounded-lg border-2 transition-all",
                isRevealed
                  ? "border-amber-300 bg-white"
                  : "border-amber-200 bg-amber-100/50"
              )}
            >
              <button
                onClick={() => handleRevealHint(index)}
                disabled={hintsAvailable === 0 && !isRevealed}
                className={cn(
                  "w-full flex items-center justify-between p-3 text-left",
                  "hover:bg-amber-100/50 transition-colors rounded-lg",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <span className="text-sm font-medium text-amber-900">
                  Pista {index + 1}
                  {isRevealed && " (revelada)"}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-amber-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-amber-600" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1">
                      <p className="text-sm text-amber-950 leading-relaxed">
                        {hint}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {hintsAvailable === 0 && hintsUsed > 0 && (
        <div className="mt-3 text-xs text-amber-700 text-center">
          Has usado todas tus pistas. ¡Intenta resolver por tu cuenta!
        </div>
      )}
    </motion.div>
  )
}

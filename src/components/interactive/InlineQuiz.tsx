"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, HelpCircle, Trophy, Zap, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useGamificationStore, calculateQuizXP } from "@/stores/gamification-store"
import { useCelebration } from "@/hooks/useCelebration"

export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create"
export type QuestionType = "multiple-choice" | "true-false"

interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
  explanation?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  bloomLevel: BloomLevel
  type: QuestionType
  hint?: string
  explanation: string
}

interface InlineQuizProps {
  questions: QuizQuestion[]
  title?: string
  onComplete?: (score: number, attempts: number) => void
}

const bloomLevelConfig: Record<BloomLevel, { label: string; color: string; description: string }> = {
  remember: {
    label: "Recordar",
    color: "bg-gray-500/10 text-text-secondary border-gray-500/20",
    description: "Conocimiento básico"
  },
  understand: {
    label: "Comprender",
    color: "bg-blue-500/10 text-info border-blue-500/20",
    description: "Entendimiento conceptual"
  },
  apply: {
    label: "Aplicar",
    color: "bg-green-500/10 text-success border-green-500/20",
    description: "Uso práctico"
  },
  analyze: {
    label: "Analizar",
    color: "bg-yellow-500/10 text-warning border-yellow-500/20",
    description: "Pensamiento crítico"
  },
  evaluate: {
    label: "Evaluar",
    color: "bg-orange-500/10 text-streak-orange border-orange-500/20",
    description: "Juicio informado"
  },
  create: {
    label: "Crear",
    color: "bg-purple-500/10 text-icon-primary border-purple-500/20",
    description: "Síntesis creativa"
  }
}

export function InlineQuiz({ questions, title = "Quiz Interactivo", onComplete }: InlineQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const { addXP } = useGamificationStore()
  const { celebrate } = useCelebration()

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const bloomConfig = bloomLevelConfig[currentQuestion.bloomLevel]

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    if (!selectedOption || isAnswered) return

    const selectedOptionData = currentQuestion.options.find(opt => opt.id === selectedOption)
    const isCorrect = selectedOptionData?.isCorrect || false

    setIsAnswered(true)
    setAttempts(prev => prev + 1)

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
      setShowHint(false)
    } else {
      // Quiz completed
      const finalScore = score / questions.length
      const xpEarned = calculateQuizXP(finalScore, attempts)

      setIsCompleted(true)

      // Award XP
      if (xpEarned > 0) {
        addXP(xpEarned, `Quiz completado: ${(finalScore * 100).toFixed(0)}%`)
      }

      // Celebrate if perfect score
      if (finalScore >= 1.0) {
        celebrate("perfect-quiz")
      }

      // Call onComplete callback
      if (onComplete) {
        onComplete(finalScore, attempts)
      }
    }
  }

  if (isCompleted) {
    const finalScore = score / questions.length
    const percentage = finalScore * 100

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm p-6">
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center"
            >
              <Trophy className="w-10 h-10 text-text-primary" />
            </motion.div>

            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {percentage >= 100
                  ? "¡Perfecto! 🎉"
                  : percentage >= 70
                  ? "¡Bien hecho! 👏"
                  : "¡Sigue practicando! 💪"}
              </h3>
              <p className="text-text-secondary">Has completado el quiz</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="text-xs text-text-secondary mb-1">Puntuación</p>
                <p className="text-2xl font-bold text-text-primary">{percentage.toFixed(0)}%</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="text-xs text-text-secondary mb-1">Correctas</p>
                <p className="text-2xl font-bold text-success">{score}/{questions.length}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                <p className="text-xs text-text-secondary mb-1">XP Ganado</p>
                <p className="text-2xl font-bold text-warning">+{calculateQuizXP(finalScore, attempts)}</p>
              </div>
            </div>

            {percentage < 70 && (
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm text-blue-300">
                  💡 Revisa los conceptos y vuelve a intentarlo para mejorar tu puntuación
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Target className="w-4 h-4 text-icon-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
                <p className="text-xs text-text-secondary">
                  Pregunta {currentQuestionIndex + 1} de {questions.length}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn("text-xs", bloomConfig.color)}>
              {bloomConfig.label}
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Question */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-lg font-medium text-text-primary mb-2">{currentQuestion.question}</h4>
            {currentQuestion.hint && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-text-secondary hover:text-text-body"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                {showHint ? "Ocultar pista" : "Ver pista"}
              </Button>
            )}
            <AnimatePresence>
              {showHint && currentQuestion.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3"
                >
                  <p className="text-sm text-yellow-300">💡 {currentQuestion.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id
              const isCorrect = option.isCorrect
              const showFeedback = isAnswered && isSelected

              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all duration-200",
                    "hover:border-white/30",
                    isSelected && !isAnswered && "border-blue-500/50 bg-blue-500/10",
                    showFeedback && isCorrect && "border-green-500/50 bg-green-500/10",
                    showFeedback && !isCorrect && "border-red-500/50 bg-red-500/10",
                    !isSelected && !showFeedback && "border-white/10 bg-black/30",
                    isAnswered && "cursor-not-allowed opacity-75"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                        isSelected && !isAnswered && "border-blue-500 bg-blue-500/20",
                        showFeedback && isCorrect && "border-green-500 bg-green-500/20",
                        showFeedback && !isCorrect && "border-red-500 bg-red-500/20",
                        !isSelected && !showFeedback && "border-gray-500"
                      )}
                    >
                      {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4 text-success" />}
                      {showFeedback && !isCorrect && <XCircle className="w-4 h-4 text-error" />}
                      {isSelected && !isAnswered && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-primary">{option.text}</p>
                      {showFeedback && option.explanation && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-text-secondary mt-2"
                        >
                          {option.explanation}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Explanation after answering */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-300 mb-1">Explicación</p>
                    <p className="text-sm text-text-body">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {!isAnswered ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirmar Respuesta
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {currentQuestionIndex < questions.length - 1 ? "Siguiente Pregunta" : "Ver Resultados"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

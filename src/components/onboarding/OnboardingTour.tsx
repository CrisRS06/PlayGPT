"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, MessageSquare, BookOpen, BarChart3, Zap, Crown,
  Target, Trophy, ArrowRight, X, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLearningModeStore } from "@/stores/learning-mode-store"
import { useGamificationStore } from "@/stores/gamification-store"
import confetti from "canvas-confetti"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: typeof Sparkles
  color: string
  bgColor: string
  feature: string
  benefits: string[]
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "¡Bienvenido a PlayGPT EDU!",
    description: "Tu plataforma educativa impulsada por IA para aprender sobre juego responsable",
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    feature: "Sistema educativo avanzado",
    benefits: [
      "Aprendizaje personalizado con IA",
      "Gamificación y recompensas",
      "Seguimiento de progreso en tiempo real"
    ]
  },
  {
    id: "mode-toggle",
    title: "Elige tu Modo de Aprendizaje",
    description: "Alterna entre Modo Guiado (con estructura) y Modo Libre (exploración)",
    icon: BookOpen,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    feature: "Modo Guiado vs Libre",
    benefits: [
      "Modo Guiado: Estructura activa del aprendizaje",
      "Quizzes automáticos y recomendaciones",
      "Modo Libre: Conversación a tu ritmo"
    ]
  },
  {
    id: "quick-actions",
    title: "Herramientas Interactivas",
    description: "Accede rápidamente a calculadoras, simuladores y más",
    icon: Zap,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    feature: "Acciones Rápidas",
    benefits: [
      "Calculadora de Valor Esperado",
      "Simulador de apuestas",
      "Visualización de progreso"
    ]
  },
  {
    id: "gamification",
    title: "Sistema de Gamificación",
    description: "Gana XP, sube de nivel y desbloquea logros mientras aprendes",
    icon: Trophy,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    feature: "XP y Logros",
    benefits: [
      "Gana XP por cada actividad",
      "Mantén rachas de estudio",
      "Desbloquea logros especiales"
    ]
  },
  {
    id: "features",
    title: "Explora las Características",
    description: "Dashboard, Skill Tree, Aprendizaje Adaptativo y más",
    icon: Crown,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    feature: "Características Avanzadas",
    benefits: [
      "📊 Dashboard con métricas detalladas",
      "🌳 Skill Tree visual",
      "🧠 Aprendizaje adaptativo con BKT",
      "🏈 Simuladores especializados"
    ]
  }
]

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const { showOnboarding, completeOnboarding, skipOnboarding } = useLearningModeStore()
  const { addXP } = useGamificationStore()

  const step = ONBOARDING_STEPS[currentStep]
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  useEffect(() => {
    if (showOnboarding && currentStep === 0) {
      // Welcome confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [showOnboarding, currentStep])

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    skipOnboarding()
  }

  const handleComplete = () => {
    // Award XP for completing onboarding
    addXP(50, "¡Tutorial completado!")

    // Completion confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    })

    setTimeout(() => {
      completeOnboarding()
    }, 500)
  }

  if (!showOnboarding) return null

  const Icon = step.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className={cn("p-6 border-b border-white/10", step.bgColor)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  step.bgColor,
                  "border border-white/10"
                )}>
                  <Icon className={cn("w-6 h-6", step.color)} />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 text-xs bg-white/5 text-white border-white/20">
                    Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
                  </Badge>
                  <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="text-gray-400 hover:text-white"
                aria-label="Saltar tutorial"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-lg text-gray-300">{step.description}</p>

                <div className={cn("p-4 rounded-lg border", step.bgColor, "border-white/10")}>
                  <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Target className={cn("w-4 h-4", step.color)} />
                    {step.feature}
                  </p>
                  <ul className="space-y-2">
                    {step.benefits.map((benefit, index) => (
                      <motion.li
                        key={`${step.id}-benefit-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <Check className={cn("w-4 h-4 mt-0.5 flex-shrink-0", step.color)} />
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Special content for specific steps */}
                {step.id === "welcome" && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                    <p className="text-sm text-purple-300 text-center">
                      🎉 Completa este tutorial para ganar <strong>+50 XP</strong> y empezar con ventaja
                    </p>
                  </div>
                )}

                {step.id === "gamification" && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                      <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Logros</p>
                      <p className="text-sm font-bold text-white">Desbloquea</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                      <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">XP Total</p>
                      <p className="text-sm font-bold text-white">Acumula</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                      <Target className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Rachas</p>
                      <p className="text-sm font-bold text-white">Mantén</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-black/30">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {ONBOARDING_STEPS.map((stepItem, index) => (
                  <div
                    key={stepItem.id}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentStep
                        ? `${step.color.replace('text-', 'bg-')} w-6`
                        : index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-700"
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="border-white/10 hover:bg-white/5"
                  >
                    Anterior
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className={cn(
                    "bg-gradient-to-r",
                    isLastStep
                      ? "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      : `from-${step.color.split('-')[1]}-500 to-${step.color.split('-')[1]}-600`
                  )}
                >
                  {isLastStep ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Empezar
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

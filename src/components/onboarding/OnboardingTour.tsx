"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, MessageSquare, BookOpen, BarChart3, Zap, Crown,
  Target, Trophy, ArrowRight, X, Check, ChevronDown, ChevronUp, Minimize2
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
    color: "text-icon-primary",
    bgColor: "bg-primary/10",
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
    color: "text-info",
    bgColor: "bg-info/10",
    feature: "Modo Guiado vs Libre",
    benefits: [
      "Modo Guiado: Estructura del aprendizaje",
      "Quizzes automáticos y recomendaciones",
      "Modo Libre: Conversación a tu ritmo"
    ]
  },
  {
    id: "quick-actions",
    title: "Herramientas Interactivas",
    description: "Accede rápidamente a calculadoras, simuladores y más",
    icon: Zap,
    color: "text-warning",
    bgColor: "bg-warning/10",
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
    color: "text-achievement-gold",
    bgColor: "bg-achievement-gold/10",
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
    color: "text-success",
    bgColor: "bg-success/10",
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
  const [isMinimized, setIsMinimized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
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

  // Minimized floating button
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        aria-label="Abrir tutorial"
      >
        <Sparkles className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-background">{currentStep + 1}</span>
        </div>
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="fixed bottom-6 right-6 z-40 w-full max-w-sm"
      >
        <div className="glass-card rounded-2xl border border-border-strong shadow-2xl overflow-hidden bg-surface-elevated/95 backdrop-blur-xl">
          {/* Compact Header */}
          <div className="p-4 border-b border-border-strong bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/40 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-icon-primary" />
                </div>
                <div>
                  <Badge variant="outline" className="text-xs bg-primary/20 text-icon-primary border-primary/40 mb-1">
                    {currentStep + 1} de {ONBOARDING_STEPS.length}
                  </Badge>
                  <h3 className="text-sm font-bold text-text-primary">{step.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsMinimized(true)}
                  className="text-icon-muted hover:text-text-primary h-7 w-7"
                  aria-label="Minimizar"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleSkip}
                  className="text-icon-muted hover:text-text-primary h-7 w-7"
                  aria-label="Cerrar tutorial"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          {/* Collapsible Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <p className="text-sm text-text-body leading-relaxed">{step.description}</p>

                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <p className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-icon-primary" />
                          {step.feature}
                        </p>
                        <ul className="space-y-1.5">
                          {step.benefits.map((benefit, index) => (
                            <motion.li
                              key={`${step.id}-benefit-${index}`}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-1.5 text-xs text-text-body"
                            >
                              <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-success" />
                              <span>{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Special content for specific steps */}
                      {step.id === "welcome" && (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/40">
                          <p className="text-xs text-text-primary text-center">
                            🎉 Completa este tutorial para ganar <strong className="text-warning">+50 XP</strong>
                          </p>
                        </div>
                      )}

                      {step.id === "gamification" && (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/30">
                            <Trophy className="w-4 h-4 text-achievement-gold mx-auto mb-1" />
                            <p className="text-xs text-text-body">Logros</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/30">
                            <Zap className="w-4 h-4 text-info mx-auto mb-1" />
                            <p className="text-xs text-text-body">XP Total</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/30">
                            <Target className="w-4 h-4 text-streak-orange mx-auto mb-1" />
                            <p className="text-xs text-text-body">Rachas</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact Footer */}
          <div className="p-3 border-t border-border-strong bg-surface-base/50">
            <div className="flex items-center justify-between gap-3 mb-2">
              {/* Step Indicators */}
              <div className="flex items-center gap-1.5">
                {ONBOARDING_STEPS.map((stepItem, index) => (
                  <div
                    key={stepItem.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      index === currentStep
                        ? "bg-primary w-6"
                        : index < currentStep
                        ? "bg-success w-3"
                        : "bg-border-strong w-3"
                    )}
                  />
                ))}
              </div>

              {/* Expand/Collapse Button */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-icon-muted hover:text-text-primary h-6 w-6"
                aria-label={isExpanded ? "Colapsar" : "Expandir"}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 text-xs"
                >
                  Anterior
                </Button>
              )}
              <Button
                onClick={handleNext}
                size="sm"
                className={cn(
                  "flex-1 text-xs",
                  isLastStep && "bg-success hover:bg-success/90"
                )}
              >
                {isLastStep ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Empezar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Brain, Calculator, DollarSign, Target } from "lucide-react"
import { useLearningProgressStore } from "@/stores/learning-progress-store"
import { useGamificationStore } from "@/stores/gamification-store"
import { Badge } from "@/components/ui/badge"
import autoAnimate from "@formkit/auto-animate"
import { cn } from "@/lib/utils"

interface PromptSuggestion {
  id: string
  text: string
  category: "probability" | "strategy" | "psychology" | "bankroll" | "tools"
  difficulty: "basic" | "intermediate" | "advanced"
  xpReward: number
  icon: typeof Sparkles
  moduleId?: string
}

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void
  currentContext?: string // Current conversation topic
}

// Comprehensive prompt database
const ALL_PROMPTS: PromptSuggestion[] = [
  // Foundations Module (Probability & Basic Concepts)
  {
    id: "ev-basic",
    text: "¿Qué es el valor esperado y cómo se calcula?",
    category: "probability",
    difficulty: "basic",
    xpReward: 10,
    icon: Calculator,
    moduleId: "module-1-foundations"
  },
  {
    id: "gambler-fallacy",
    text: "Explícame la falacia del jugador con un ejemplo",
    category: "psychology",
    difficulty: "basic",
    xpReward: 10,
    icon: Brain,
    moduleId: "module-1-foundations"
  },
  {
    id: "probability-basics",
    text: "¿Cómo funciona la probabilidad en las apuestas?",
    category: "probability",
    difficulty: "basic",
    xpReward: 10,
    icon: Target,
    moduleId: "module-1-foundations"
  },
  {
    id: "house-edge",
    text: "¿Qué es la ventaja de la casa y cómo afecta mis apuestas?",
    category: "strategy",
    difficulty: "intermediate",
    xpReward: 15,
    icon: TrendingUp,
    moduleId: "module-1-foundations"
  },

  // Sports Betting Module
  {
    id: "odds-types",
    text: "¿Cuáles son los diferentes tipos de odds y cómo leerlos?",
    category: "strategy",
    difficulty: "basic",
    xpReward: 10,
    icon: Target,
    moduleId: "module-2-sports-betting"
  },
  {
    id: "american-odds",
    text: "Explícame las odds americanas con ejemplos prácticos",
    category: "strategy",
    difficulty: "intermediate",
    xpReward: 15,
    icon: Calculator,
    moduleId: "module-2-sports-betting"
  },
  {
    id: "parlay-bets",
    text: "¿Cómo funcionan las apuestas parlay y son rentables?",
    category: "strategy",
    difficulty: "intermediate",
    xpReward: 20,
    icon: TrendingUp,
    moduleId: "module-2-sports-betting"
  },
  {
    id: "ev-sports",
    text: "¿Cómo calcular el valor esperado en apuestas deportivas?",
    category: "probability",
    difficulty: "advanced",
    xpReward: 25,
    icon: Calculator,
    moduleId: "module-2-sports-betting"
  },

  // Bankroll Module
  {
    id: "kelly-criterion",
    text: "¿Cómo funciona el Kelly Criterion para gestión de bankroll?",
    category: "bankroll",
    difficulty: "advanced",
    xpReward: 25,
    icon: DollarSign,
    moduleId: "module-3-bankroll"
  },
  {
    id: "bankroll-basics",
    text: "¿Cuánto debería apostar de mi bankroll?",
    category: "bankroll",
    difficulty: "basic",
    xpReward: 10,
    icon: DollarSign,
    moduleId: "module-3-bankroll"
  },
  {
    id: "unit-sizing",
    text: "¿Qué es el unit sizing y cómo aplicarlo?",
    category: "bankroll",
    difficulty: "intermediate",
    xpReward: 15,
    icon: Calculator,
    moduleId: "module-3-bankroll"
  },
  {
    id: "variance",
    text: "¿Cómo manejar la varianza en mi bankroll?",
    category: "strategy",
    difficulty: "advanced",
    xpReward: 20,
    icon: TrendingUp,
    moduleId: "module-3-bankroll"
  },

  // Psychology Module
  {
    id: "tilt-control",
    text: "¿Cómo controlar el tilt y tomar mejores decisiones?",
    category: "psychology",
    difficulty: "intermediate",
    xpReward: 15,
    icon: Brain,
    moduleId: "module-4-psychology"
  },
  {
    id: "cognitive-biases",
    text: "¿Cuáles son los sesgos cognitivos más comunes al apostar?",
    category: "psychology",
    difficulty: "intermediate",
    xpReward: 20,
    icon: Brain,
    moduleId: "module-4-psychology"
  },
  {
    id: "emotional-control",
    text: "Estrategias para mantener control emocional al apostar",
    category: "psychology",
    difficulty: "advanced",
    xpReward: 25,
    icon: Brain,
    moduleId: "module-4-psychology"
  },

  // Tools & Calculators
  {
    id: "ev-calculator",
    text: "Ayúdame a calcular el EV de una apuesta específica",
    category: "tools",
    difficulty: "intermediate",
    xpReward: 15,
    icon: Calculator
  },
  {
    id: "kelly-calculator",
    text: "Calcula mi tamaño de apuesta óptimo con Kelly",
    category: "tools",
    difficulty: "advanced",
    xpReward: 20,
    icon: Calculator
  }
]

export function SuggestedPrompts({ onSelectPrompt, currentContext }: SuggestedPromptsProps) {
  const promptsRef = useRef<HTMLDivElement>(null)
  const { modules, currentModuleId } = useLearningProgressStore()
  const { level } = useGamificationStore()

  // Auto-animate prompts
  useEffect(() => {
    if (promptsRef.current) {
      autoAnimate(promptsRef.current)
    }
  }, [])

  // Get contextual prompts based on current module and level
  const getContextualPrompts = (): PromptSuggestion[] => {
    const currentModule = currentModuleId ? modules[currentModuleId] : null
    let relevantPrompts: PromptSuggestion[] = []

    // Filter by current module
    if (currentModule) {
      relevantPrompts = ALL_PROMPTS.filter(p => p.moduleId === currentModuleId)
    }

    // If no module-specific prompts or module complete, show general prompts
    if (relevantPrompts.length === 0) {
      relevantPrompts = ALL_PROMPTS.filter(p => !p.moduleId || p.difficulty === "basic")
    }

    // Filter by user level (difficulty matching)
    if (level <= 3) {
      // Beginner: show basic and some intermediate
      relevantPrompts = relevantPrompts.filter(p =>
        p.difficulty === "basic" || p.difficulty === "intermediate"
      )
    } else if (level <= 10) {
      // Intermediate: show all levels
      // No filtering needed
    } else {
      // Advanced: prioritize intermediate and advanced
      relevantPrompts = relevantPrompts.filter(p =>
        p.difficulty === "intermediate" || p.difficulty === "advanced"
      )
    }

    // Return top 4 suggestions
    return relevantPrompts.slice(0, 4)
  }

  const suggestions = getContextualPrompts()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "bg-green-500/10 text-success border-green-500/20"
      case "intermediate":
        return "bg-yellow-500/10 text-warning border-yellow-500/20"
      case "advanced":
        return "bg-red-500/10 text-error border-red-500/20"
      default:
        return "bg-gray-500/10 text-text-tertiary border-gray-500/20"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "probability":
        return "bg-blue-500/10 text-info border-blue-500/20"
      case "strategy":
        return "bg-purple-500/10 text-icon-primary border-purple-500/20"
      case "psychology":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20"
      case "bankroll":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "tools":
        return "bg-orange-500/10 text-streak-orange border-orange-500/20"
      default:
        return "bg-gray-500/10 text-text-secondary border-gray-500/20"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "Básico"
      case "intermediate":
        return "Intermedio"
      case "advanced":
        return "Avanzado"
      default:
        return difficulty
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "probability":
        return "Probabilidad"
      case "strategy":
        return "Estrategia"
      case "psychology":
        return "Psicología"
      case "bankroll":
        return "Bankroll"
      case "tools":
        return "Herramientas"
      default:
        return category
    }
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-sm font-medium text-text-secondary">Preguntas sugeridas para ti</p>
      </div>

      <div ref={promptsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon

          return (
            <motion.button
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPrompt(suggestion.text)}
              className={cn(
                "group relative p-4 rounded-lg border text-left transition-all",
                "bg-gray-100 border-gray-200 hover:border-primary/50 hover:bg-white"
              )}
            >
              {/* Content */}
              <div className="space-y-3">
                {/* Icon & Text */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-text-primary font-medium leading-snug flex-1">
                    {suggestion.text}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs", getDifficultyColor(suggestion.difficulty))}>
                    {getDifficultyLabel(suggestion.difficulty)}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs", getCategoryColor(suggestion.category))}>
                    {getCategoryLabel(suggestion.category)}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    +{suggestion.xpReward} XP
                  </Badge>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

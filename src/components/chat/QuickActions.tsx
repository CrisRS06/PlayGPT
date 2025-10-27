"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Dices, TrendingUp, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { EVCalculator } from "@/components/interactive/EVCalculator"
import { BettingSimulator } from "@/components/interactive/BettingSimulator"
import { KnowledgeProgressChart } from "@/components/interactive/KnowledgeProgressChart"
import { useLearningModeStore } from "@/stores/learning-mode-store"

interface QuickAction {
  id: string
  label: string
  icon: typeof Calculator
  description: string
  component: React.ReactNode
  color: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "ev-calculator",
    label: "Calculadora EV",
    icon: Calculator,
    description: "Calcula el valor esperado de cualquier apuesta",
    component: <EVCalculator />,
    color: "text-primary"
  },
  {
    id: "betting-sim",
    label: "Simulador",
    icon: Dices,
    description: "Simula miles de apuestas y visualiza resultados",
    component: <BettingSimulator />,
    color: "text-accent"
  },
  {
    id: "progress",
    label: "Mi Progreso",
    icon: TrendingUp,
    description: "Visualiza tu evolución de aprendizaje",
    component: <KnowledgeProgressChart variant="compact" />,
    color: "text-primary"
  }
]

export function QuickActions() {
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)
  const { mode } = useLearningModeStore()
  const isGuided = mode === 'guided'

  // Only show in guided mode and if not dismissed
  if (!isGuided || isDismissed) return null

  return (
    <>
      {/* Horizontal Scroll Quick Actions - Non-blocking design */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className="relative px-4 pb-2"
        >
          {/* Dismissible hint */}
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-xs text-gray-600 font-medium">Herramientas sugeridas</span>
            <button
              onClick={() => setIsDismissed(true)}
              className="touch-target-mobile p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Ocultar acciones rápidas"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          {/* Horizontal scrollable chips */}
          <div className="relative">
            {/* Fade gradient for scroll indication */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 scroll-smooth">
              {QUICK_ACTIONS.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedAction(action)}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 min-h-[48px]",
                      "rounded-full bg-white border-2 border-gray-200",
                      "hover:border-primary hover:bg-primary/5",
                      "transition-all duration-200",
                      "whitespace-nowrap flex-shrink-0",
                      "active:scale-95"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", action.color)} />
                    <span className="text-sm font-medium text-gray-900">{action.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
          {selectedAction && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    "bg-primary/20 border border-primary/40"
                  )}>
                    <selectedAction.icon className={cn("w-5 h-5", selectedAction.color)} />
                  </div>
                  <div>
                    <DialogTitle className="text-text-primary">{selectedAction.label}</DialogTitle>
                    <DialogDescription className="text-text-secondary">
                      {selectedAction.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="mt-4">
                {selectedAction.component}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

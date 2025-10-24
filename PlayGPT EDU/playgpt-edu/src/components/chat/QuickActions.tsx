"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Brain, Dices, TrendingUp, Sparkles, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
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
  badge?: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "ev-calculator",
    label: "Calculadora EV",
    icon: Calculator,
    description: "Calcula el valor esperado de cualquier apuesta",
    component: <EVCalculator />,
    color: "text-blue-400",
    badge: "Popular"
  },
  {
    id: "betting-sim",
    label: "Simulador",
    icon: Dices,
    description: "Simula miles de apuestas y visualiza resultados",
    component: <BettingSimulator />,
    color: "text-green-400"
  },
  {
    id: "progress",
    label: "Mi Progreso",
    icon: TrendingUp,
    description: "Visualiza tu evolución de aprendizaje",
    component: <KnowledgeProgressChart variant="compact" />,
    color: "text-purple-400"
  }
]

export function QuickActions() {
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const { mode } = useLearningModeStore()
  const isGuided = mode === 'guided'

  // Only show in guided mode by default
  if (!isGuided && !isExpanded) return null

  return (
    <>
      {/* Quick Actions Bar */}
      <AnimatePresence>
        {(isGuided || isExpanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="mx-auto max-w-4xl px-6 py-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-white">Acciones Rápidas</span>
                  <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/20">
                    Modo Guiado
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {QUICK_ACTIONS.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedAction(action)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all group",
                        "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20",
                        "text-left w-full"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-white/5", action.color)}>
                        <Icon className={cn("w-5 h-5", action.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{action.label}</span>
                          {action.badge && (
                            <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{action.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-white/10">
          {selectedAction && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    "bg-white/5 border border-white/10"
                  )}>
                    <selectedAction.icon className={cn("w-5 h-5", selectedAction.color)} />
                  </div>
                  <div>
                    <DialogTitle className="text-white">{selectedAction.label}</DialogTitle>
                    <DialogDescription className="text-gray-400">
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

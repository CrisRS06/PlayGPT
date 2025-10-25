"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Compass, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLearningModeStore, getModeDescription } from "@/stores/learning-mode-store"
import { toast } from "sonner"

interface ModeToggleProps {
  compact?: boolean
}

export function ModeToggle({ compact = false }: ModeToggleProps) {
  const { mode, toggleMode, guidedSettings, updateGuidedSettings } = useLearningModeStore()
  const isGuided = mode === 'guided'
  const modeInfo = getModeDescription(mode)

  const handleToggle = () => {
    toggleMode()
    const newMode = mode === 'free' ? 'guided' : 'free'
    const newModeInfo = getModeDescription(newMode)

    toast.success(`Cambiado a ${newModeInfo.title}`, {
      description: newModeInfo.description,
      duration: 3000
    })
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className={cn(
                "relative transition-all",
                isGuided ? "text-icon-primary hover:text-purple-300" : "text-info hover:text-blue-300"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.8, opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {isGuided ? (
                    <BookOpen className="h-5 w-5" />
                  ) : (
                    <Compass className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-900 border-gray-200">
            <div className="space-y-1">
              <p className="font-semibold">{modeInfo.title}</p>
              <p className="text-xs text-text-secondary">{modeInfo.description}</p>
              <p className="text-xs text-text-tertiary mt-2">Click para cambiar</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "border-gray-200 hover:bg-white/5 transition-all group",
            isGuided
              ? "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30"
              : "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              {isGuided ? (
                <BookOpen className="h-4 w-4 text-icon-primary" />
              ) : (
                <Compass className="h-4 w-4 text-info" />
              )}
              <span className="text-sm font-medium text-text-primary">{modeInfo.title}</span>
            </motion.div>
          </AnimatePresence>
          <Info className="h-3 w-3 ml-2 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 bg-gray-900 border-gray-200 p-0"
        side="bottom"
        align="end"
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-text-primary mb-1">Modo de Aprendizaje</h4>
              <p className="text-xs text-text-secondary">
                Personaliza cómo interactúas con el asistente
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="space-y-3">
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                isGuided
                  ? "border-purple-500/50 bg-purple-500/10"
                  : "border-gray-200 bg-white/5 hover:border-gray-300"
              )}
              onClick={handleToggle}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isGuided ? "bg-purple-500/20" : "bg-gray-700/50"
              )}>
                <BookOpen className={cn("h-5 w-5", isGuided ? "text-icon-primary" : "text-text-tertiary")} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">Modo Guiado</p>
                <p className="text-xs text-text-secondary">Estructura activa del aprendizaje</p>
              </div>
              <Switch checked={isGuided} onCheckedChange={handleToggle} />
            </div>

            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                !isGuided
                  ? "border-blue-500/50 bg-blue-500/10"
                  : "border-gray-200 bg-white/5 hover:border-gray-300"
              )}
              onClick={handleToggle}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                !isGuided ? "bg-blue-500/20" : "bg-gray-700/50"
              )}>
                <Compass className={cn("h-5 w-5", !isGuided ? "text-info" : "text-text-tertiary")} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">Modo Libre</p>
                <p className="text-xs text-text-secondary">Conversación a tu propio ritmo</p>
              </div>
              <Switch checked={!isGuided} onCheckedChange={handleToggle} />
            </div>
          </div>

          {/* Current Mode Features */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "p-3 rounded-lg border",
                isGuided
                  ? "bg-purple-500/5 border-purple-500/20"
                  : "bg-blue-500/5 border-blue-500/20"
              )}
            >
              <p className="text-xs font-medium text-text-primary mb-2">Características activas:</p>
              <ul className="space-y-1.5">
                {modeInfo.features.map((feature, index) => (
                  <motion.li
                    key={`${mode}-${feature.substring(0, 20)}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 text-xs text-text-body"
                  >
                    <span className={cn(
                      "mt-0.5",
                      isGuided ? "text-icon-primary" : "text-info"
                    )}>•</span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Guided Mode Settings */}
          {isGuided && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 border-t border-gray-200 space-y-3"
            >
              <p className="text-xs font-medium text-text-primary">Configuración del Modo Guiado:</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-text-primary">Auto-sugerir temas</p>
                    <p className="text-xs text-text-tertiary">Recomendar qué estudiar siguiente</p>
                  </div>
                  <Switch
                    checked={guidedSettings.autoSuggestTopics}
                    onCheckedChange={(checked) => updateGuidedSettings({ autoSuggestTopics: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-text-primary">Quizzes inline</p>
                    <p className="text-xs text-text-tertiary">Insertar evaluaciones automáticas</p>
                  </div>
                  <Switch
                    checked={guidedSettings.showInlineQuizzes}
                    onCheckedChange={(checked) => updateGuidedSettings({ showInlineQuizzes: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-text-primary">Recomendaciones proactivas</p>
                    <p className="text-xs text-text-tertiary">Sugerencias de refuerzo</p>
                  </div>
                  <Switch
                    checked={guidedSettings.proactiveRecommendations}
                    onCheckedChange={(checked) => updateGuidedSettings({ proactiveRecommendations: checked })}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer tip */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-text-tertiary text-center">
              💡 Puedes cambiar de modo en cualquier momento
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

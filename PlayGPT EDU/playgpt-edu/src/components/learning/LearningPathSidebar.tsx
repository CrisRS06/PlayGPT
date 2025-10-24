"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, Lock, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useLearningProgressStore } from "@/stores/learning-progress-store"
import { useGamificationStore } from "@/stores/gamification-store"
import { XPProgressBar } from "@/components/gamification/XPProgressBar"
import { StreakIndicator } from "@/components/gamification/StreakIndicator"
import autoAnimate from "@formkit/auto-animate"
import { cn } from "@/lib/utils"

interface LearningPathSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function LearningPathSidebar({ isOpen, onClose }: LearningPathSidebarProps) {
  const modulesParentRef = useRef<HTMLDivElement>(null)
  const { modules, getModuleProgress } = useLearningProgressStore()
  const { level, totalXP, xpToNextLevel } = useGamificationStore()

  // Auto-animate module list
  useEffect(() => {
    if (modulesParentRef.current) {
      autoAnimate(modulesParentRef.current)
    }
  }, [])

  const modulesList = Object.values(modules).sort((a, b) => a.order - b.order)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Circle className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
      case 'available':
        return <Circle className="w-5 h-5 text-blue-500" />
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-500" />
      default:
        return <Circle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/30 bg-green-500/5'
      case 'in-progress':
        return 'border-yellow-500/30 bg-yellow-500/5'
      case 'available':
        return 'border-blue-500/30 bg-blue-500/5'
      case 'locked':
        return 'border-white/10 bg-white/5 opacity-60'
      default:
        return 'border-white/10 bg-white/5'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-black border-r border-white/10 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-white">Ruta de Aprendizaje</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                  aria-label="Cerrar ruta de aprendizaje"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Gamification Stats */}
              <div className="space-y-4">
                <XPProgressBar />
                <Separator className="bg-white/10" />
                <StreakIndicator />
              </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-4" ref={modulesParentRef}>
              <div className="space-y-3">
                {modulesList.map((module, index) => {
                  const progress = getModuleProgress(module.id)

                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "relative rounded-lg border p-4 transition-all",
                        getStatusColor(module.status),
                        module.status !== 'locked' && "hover:border-white/20 cursor-pointer"
                      )}
                    >
                      {/* Module Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-2xl flex-shrink-0">{module.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-white text-sm leading-tight">
                              {module.title}
                            </h3>
                            {getStatusIcon(module.status)}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {module.description}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {module.status !== 'locked' && (
                        <div className="space-y-1">
                          <Progress value={progress} className="h-1.5" />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              {module.completedLessons}/{module.totalLessons} lecciones
                            </span>
                            <span className="text-gray-500">{Math.round(progress)}%</span>
                          </div>
                        </div>
                      )}

                      {/* Locked State */}
                      {module.status === 'locked' && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Lock className="w-3 h-3" />
                          <span>Completa el módulo anterior</span>
                        </div>
                      )}

                      {/* Completion Badge */}
                      {module.status === 'completed' && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          ✓ Completado
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="text-center text-xs text-gray-500">
                <p>Progreso total del curso</p>
                <p className="text-white font-semibold mt-1">
                  {modulesList.filter(m => m.status === 'completed').length}/{modulesList.length} módulos
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

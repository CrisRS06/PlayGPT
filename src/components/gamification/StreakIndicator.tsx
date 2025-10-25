"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, Shield } from "lucide-react"
import { useGamificationStore } from "@/stores/gamification-store"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface StreakIndicatorProps {
  compact?: boolean
  className?: string
}

export function StreakIndicator({ compact = false, className }: StreakIndicatorProps) {
  const { currentStreak, longestStreak, streakFreezes, checkStreak } = useGamificationStore()
  const [animate, setAnimate] = useState(false)

  // Check streak on mount
  useEffect(() => {
    checkStreak()
  }, [checkStreak])

  // Trigger animation when streak updates
  useEffect(() => {
    if (currentStreak > 0) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 600)
      return () => clearTimeout(timer)
    }
  }, [currentStreak])

  const getStreakColor = () => {
    if (currentStreak >= 30) return "text-error"
    if (currentStreak >= 14) return "text-streak-orange"
    if (currentStreak >= 7) return "text-warning"
    if (currentStreak >= 3) return "text-info"
    return "text-text-tertiary"
  }

  const getStreakMessage = () => {
    if (currentStreak === 0) return "¡Empieza tu racha!"
    if (currentStreak === 1) return "¡Primera racha!"
    if (currentStreak >= 30) return "¡Leyenda!"
    if (currentStreak >= 14) return "¡Imparable!"
    if (currentStreak >= 7) return "¡En fuego!"
    if (currentStreak >= 3) return "¡Sigue así!"
    return "¡Bien hecho!"
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <motion.div
          animate={animate ? { scale: [1, 1.2, 1] } : {}}
          className="flex items-center gap-1"
        >
          <Flame className={cn("w-4 h-4", getStreakColor())} />
          <span className={cn("text-sm font-semibold", getStreakColor())}>
            {currentStreak}
          </span>
        </motion.div>

        {streakFreezes > 0 && (
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-info border-blue-500/20">
            <Shield className="w-3 h-3 mr-1" />
            {streakFreezes}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-2", className)}
    >
      <div className="flex items-center justify-between">
        {/* Current Streak */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={animate ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
            className="relative"
          >
            <Flame className={cn("w-8 h-8", getStreakColor())} />
            {currentStreak >= 7 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 blur-lg opacity-50"
              >
                <Flame className={cn("w-8 h-8", getStreakColor())} />
              </motion.div>
            )}
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <span className={cn("text-2xl font-bold", getStreakColor())}>
                {currentStreak}
              </span>
              <span className="text-sm text-text-secondary">
                {currentStreak === 1 ? "día" : "días"}
              </span>
            </div>
            <p className="text-xs text-text-tertiary">{getStreakMessage()}</p>
          </div>
        </div>

        {/* Longest Streak & Freezes */}
        <div className="flex items-center gap-3">
          {longestStreak > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Trophy className="w-3.5 h-3.5 text-warning" />
                <span className="text-sm font-semibold text-warning">
                  {longestStreak}
                </span>
              </div>
              <p className="text-xs text-text-tertiary">Récord</p>
            </div>
          )}

          {streakFreezes > 0 && (
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-info border-blue-500/20"
            >
              <Shield className="w-4 h-4 mr-1.5" />
              {streakFreezes} {streakFreezes === 1 ? "congelador" : "congeladores"}
            </Badge>
          )}
        </div>
      </div>

      {/* Milestone Progress */}
      {currentStreak > 0 && currentStreak < 30 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Próximo hito</span>
            <span>
              {currentStreak < 3 && `${3 - currentStreak} días para racha de 3`}
              {currentStreak >= 3 && currentStreak < 7 && `${7 - currentStreak} días para racha de 7`}
              {currentStreak >= 7 && currentStreak < 14 && `${14 - currentStreak} días para racha de 14`}
              {currentStreak >= 14 && currentStreak < 30 && `${30 - currentStreak} días para racha de 30`}
            </span>
          </div>
          <div className="h-1 bg-white rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  currentStreak < 3
                    ? (currentStreak / 3) * 100
                    : currentStreak < 7
                    ? ((currentStreak - 3) / 4) * 100
                    : currentStreak < 14
                    ? ((currentStreak - 7) / 7) * 100
                    : ((currentStreak - 14) / 16) * 100
                }%`
              }}
              className={cn("h-full", getStreakColor(), "bg-current")}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Zap, TrendingUp } from "lucide-react"
import { useGamificationStore } from "@/stores/gamification-store"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { calculateLevel, getLevelTitle } from "@/lib/gamification/xp-calculator"

interface XPProgressBarProps {
  compact?: boolean
  className?: string
}

export function XPProgressBar({ compact = false, className }: XPProgressBarProps) {
  const { totalXP, level, xpToNextLevel } = useGamificationStore()

  const levelInfo = getLevelTitle(level)
  const xpForCurrentLevel = (level - 1) * 100
  const xpInCurrentLevel = totalXP - xpForCurrentLevel
  const progressPercentage = (xpInCurrentLevel / 100) * 100

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge
          variant="outline"
          className={cn(
            "px-2 py-1 font-semibold",
            levelInfo.color,
            "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
          )}
        >
          <span className="mr-1">{levelInfo.badge}</span>
          Nivel {level}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Zap className="w-3 h-3 text-primary" />
          <span>{totalXP} XP</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-2", className)}
    >
      {/* Level Badge and XP Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "px-3 py-1.5 font-semibold text-sm",
              levelInfo.color,
              "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
            )}
          >
            <span className="mr-1.5 text-base">{levelInfo.badge}</span>
            {levelInfo.title} - Nivel {level}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-text-body">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-semibold">{totalXP}</span>
          <span className="text-text-tertiary">XP</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="relative">
          <Progress
            value={progressPercentage}
            className="h-2.5 bg-white"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-sm"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>{xpInCurrentLevel} / 100 XP</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{xpToNextLevel} XP para nivel {level + 1}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

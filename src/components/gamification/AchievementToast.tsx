"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Flame, Star, Zap, Target, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { useCelebration } from "@/hooks/useCelebration"

export interface Achievement {
  id: string
  title: string
  description: string
  icon: "trophy" | "flame" | "star" | "zap" | "target" | "award"
  xp?: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface AchievementToastProps {
  achievement: Achievement | null
  onClose: () => void
  duration?: number
}

const iconMap = {
  trophy: Trophy,
  flame: Flame,
  star: Star,
  zap: Zap,
  target: Target,
  award: Award
}

const rarityColors = {
  common: {
    gradient: "from-gray-500 to-gray-600",
    bg: "bg-gray-500/20",
    border: "border-gray-500/30",
    text: "text-gray-300",
    glow: "shadow-gray-500/50"
  },
  rare: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-300",
    glow: "shadow-blue-500/50"
  },
  epic: {
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-500/20",
    border: "border-purple-500/30",
    text: "text-purple-300",
    glow: "shadow-purple-500/50"
  },
  legendary: {
    gradient: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-300",
    glow: "shadow-yellow-500/50"
  }
}

export function AchievementToast({ achievement, onClose, duration = 5000 }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { celebrate } = useCelebration()

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      celebrate("achievement")

      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [achievement, duration, onClose, celebrate])

  if (!achievement) return null

  const Icon = iconMap[achievement.icon]
  const colors = rarityColors[achievement.rarity]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 200
          }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div
            className={`
              relative overflow-hidden rounded-xl border-2 ${colors.border}
              ${colors.bg} backdrop-blur-xl
              shadow-2xl ${colors.glow}
              p-6 min-w-[320px] max-w-md
            `}
          >
            {/* Animated Background Gradient */}
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-10`}
              style={{ backgroundSize: "200% 200%" }}
            />

            {/* Content */}
            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className={`
                  flex-shrink-0 w-14 h-14 rounded-full
                  bg-gradient-to-br ${colors.gradient}
                  flex items-center justify-center
                  shadow-lg ${colors.glow}
                `}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>

              {/* Text Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">
                    ¡Logro Desbloqueado!
                  </h3>
                  {achievement.rarity === "legendary" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  )}
                </div>
                <p className="font-semibold text-white">
                  {achievement.title}
                </p>
                <p className="text-sm text-gray-300">
                  {achievement.description}
                </p>
                {achievement.xp && (
                  <div className="flex items-center gap-1 mt-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      +{achievement.xp} XP
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} origin-left`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

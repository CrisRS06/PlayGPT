"use client"

import { useCallback } from "react"
import confetti from "canvas-confetti"

export type CelebrationType =
  | "level-up"
  | "streak-milestone"
  | "module-complete"
  | "perfect-quiz"
  | "first-lesson"
  | "achievement"

interface CelebrationConfig {
  particleCount?: number
  spread?: number
  origin?: { x: number; y: number }
  colors?: string[]
  startVelocity?: number
  scalar?: number
  ticks?: number
}

export function useCelebration() {
  const celebrate = useCallback((type: CelebrationType) => {
    const configs: Record<CelebrationType, CelebrationConfig> = {
      "level-up": {
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ["#FFD700", "#FFA500", "#FF69B4"],
        startVelocity: 45,
        scalar: 1.2,
        ticks: 200
      },
      "streak-milestone": {
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6, x: 0.5 },
        colors: ["#FF4500", "#FF6347", "#FFA07A"],
        startVelocity: 35,
        scalar: 1.0,
        ticks: 150
      },
      "module-complete": {
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6, x: 0.5 },
        colors: ["#00CED1", "#1E90FF", "#9370DB"],
        startVelocity: 50,
        scalar: 1.5,
        ticks: 250
      },
      "perfect-quiz": {
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6, x: 0.5 },
        colors: ["#32CD32", "#00FA9A", "#7FFF00"],
        startVelocity: 40,
        scalar: 1.1,
        ticks: 180
      },
      "first-lesson": {
        particleCount: 80,
        spread: 50,
        origin: { y: 0.6, x: 0.5 },
        colors: ["#FFB6C1", "#FF69B4", "#FF1493"],
        startVelocity: 30,
        scalar: 0.9,
        ticks: 120
      },
      "achievement": {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ["#FFD700", "#FFA500", "#FF8C00"],
        startVelocity: 35,
        scalar: 1.0,
        ticks: 150
      }
    }

    const config = configs[type]

    // Fire confetti
    confetti({
      ...config,
      angle: 90,
      decay: 0.91,
      gravity: 1,
      drift: 0,
      shapes: ["circle", "square"],
    })

    // Fire from left side
    setTimeout(() => {
      confetti({
        ...config,
        particleCount: Math.floor((config.particleCount || 100) / 2),
        angle: 60,
        origin: { x: 0, y: 0.6 }
      })
    }, 100)

    // Fire from right side
    setTimeout(() => {
      confetti({
        ...config,
        particleCount: Math.floor((config.particleCount || 100) / 2),
        angle: 120,
        origin: { x: 1, y: 0.6 }
      })
    }, 200)
  }, [])

  const celebrateCustom = useCallback((config: CelebrationConfig) => {
    confetti({
      ...config,
      angle: 90,
      decay: 0.91,
      gravity: 1,
    })
  }, [])

  return {
    celebrate,
    celebrateCustom
  }
}

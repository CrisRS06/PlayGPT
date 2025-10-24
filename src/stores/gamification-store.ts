import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import type { Achievement } from '@/components/gamification/AchievementToast'

// XP rewards configuration
export const XP_REWARDS = {
  LESSON_COMPLETE: 10,
  QUIZ_PERFECT: 50,
  QUIZ_PASS: 30,
  FIRST_TRY: 20,
  DAILY_LOGIN: 5,
  STREAK_MILESTONE_3: 25,
  STREAK_MILESTONE_7: 50,
  STREAK_MILESTONE_30: 200,
  CHAT_INTERACTION: 2,
} as const

interface GamificationState {
  // XP System
  totalXP: number
  level: number
  xpToNextLevel: number

  // Streaks
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakFreezes: number

  // Achievements
  unlockedAchievements: string[]
  currentAchievement: Achievement | null

  // Actions
  addXP: (amount: number, reason: string) => void
  checkStreak: () => void
  useStreakFreeze: () => void
  resetStreak: () => void
  updateLastActivity: () => void
  unlockAchievement: (achievement: Achievement) => void
  clearCurrentAchievement: () => void
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      totalXP: 0,
      level: 1,
      xpToNextLevel: 100,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakFreezes: 1, // Users get 1 free streak freeze
      unlockedAchievements: [],
      currentAchievement: null,

      // Add XP with level up detection
      addXP: (amount: number, reason: string) => {
        const state = get()
        const newTotal = state.totalXP + amount
        const newLevel = Math.floor(newTotal / 100) + 1
        const xpForCurrentLevel = (newLevel - 1) * 100
        const xpToNext = newLevel * 100 - newTotal

        set({
          totalXP: newTotal,
          level: newLevel,
          xpToNextLevel: xpToNext
        })

        // Show XP notification
        toast.success(`+${amount} XP`, {
          description: reason,
          duration: 3000
        })

        // Level up notification
        if (newLevel > state.level) {
          toast.success(`🎉 ¡Nivel ${newLevel}!`, {
            description: '¡Sigue así!',
            duration: 4000
          })
        }
      },

      // Check and update streak
      checkStreak: () => {
        const state = get()
        const today = new Date().toDateString()
        const lastDate = state.lastActivityDate

        if (!lastDate) {
          // First activity ever
          set({
            currentStreak: 1,
            longestStreak: 1,
            lastActivityDate: today
          })
          toast.success('🔥 Racha iniciada', {
            description: '¡Primer día de aprendizaje!',
            duration: 3000
          })
          return
        }

        if (lastDate === today) {
          // Already counted today
          return
        }

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()

        if (lastDate === yesterdayStr) {
          // Consecutive day - increment streak
          const newStreak = state.currentStreak + 1
          const newLongest = Math.max(newStreak, state.longestStreak)

          set({
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastActivityDate: today
          })

          toast.success(`🔥 Racha de ${newStreak} días`, {
            description: '¡Sigue así!',
            duration: 4000
          })

          // Milestone rewards
          if (newStreak === 3) {
            get().addXP(XP_REWARDS.STREAK_MILESTONE_3, 'Racha de 3 días')
          } else if (newStreak === 7) {
            get().addXP(XP_REWARDS.STREAK_MILESTONE_7, 'Racha de 7 días')
          } else if (newStreak === 30) {
            get().addXP(XP_REWARDS.STREAK_MILESTONE_30, '¡30 días consecutivos!')
          }
        } else {
          // Streak broken - check if has freeze available
          if (state.streakFreezes > 0) {
            toast.info('🛡️ Racha protegida', {
              description: `Has usado un congelador de racha. Quedan ${state.streakFreezes - 1}`,
              duration: 5000,
              action: {
                label: 'Entendido',
                onClick: () => {}
              }
            })
            set({
              streakFreezes: state.streakFreezes - 1,
              lastActivityDate: today
            })
          } else {
            get().resetStreak()
          }
        }
      },

      // Use a streak freeze
      useStreakFreeze: () => {
        const state = get()
        if (state.streakFreezes > 0) {
          set({ streakFreezes: state.streakFreezes - 1 })
          toast.success('Racha protegida', {
            description: 'Has usado un congelador de racha',
            icon: '🛡️'
          })
        }
      },

      // Reset streak (when broken and no freeze available)
      resetStreak: () => {
        set({
          currentStreak: 0,
          lastActivityDate: new Date().toDateString()
        })
        toast.error('Racha perdida', {
          description: 'Empieza una nueva racha hoy',
          icon: '💔',
          duration: 4000
        })
      },

      // Update last activity (for streak tracking)
      updateLastActivity: () => {
        set({ lastActivityDate: new Date().toDateString() })
      },

      // Unlock achievement
      unlockAchievement: (achievement: Achievement) => {
        const state = get()
        if (!state.unlockedAchievements.includes(achievement.id)) {
          set({
            unlockedAchievements: [...state.unlockedAchievements, achievement.id],
            currentAchievement: achievement
          })

          // Award XP if achievement has XP
          if (achievement.xp) {
            get().addXP(achievement.xp, `Logro: ${achievement.title}`)
          }
        }
      },

      // Clear current achievement (after toast is shown)
      clearCurrentAchievement: () => {
        set({ currentAchievement: null })
      }
    }),
    {
      name: 'gamification-storage',
    }
  )
)

// Helper function to calculate quiz XP
export function calculateQuizXP(score: number, attempts: number): number {
  let xp = 0

  if (score >= 1.0) {
    xp = XP_REWARDS.QUIZ_PERFECT
    if (attempts === 1) {
      xp += XP_REWARDS.FIRST_TRY
    }
  } else if (score >= 0.7) {
    xp = XP_REWARDS.QUIZ_PASS
  }

  return xp
}

/**
 * XP Calculator utilities
 * Handles all XP-related calculations and rewards
 */

export const XP_REWARDS = {
  // Lessons
  LESSON_START: 5,
  LESSON_COMPLETE: 10,
  MODULE_COMPLETE: 50,

  // Quizzes
  QUIZ_ATTEMPT: 5,
  QUIZ_PASS: 30,
  QUIZ_PERFECT: 50,
  FIRST_TRY_BONUS: 20,

  // Streaks
  DAILY_LOGIN: 5,
  STREAK_3_DAYS: 25,
  STREAK_7_DAYS: 50,
  STREAK_14_DAYS: 100,
  STREAK_30_DAYS: 200,

  // Chat
  CHAT_INTERACTION: 2,
  FIRST_QUESTION: 10,

  // Special
  PROFILE_COMPLETE: 25,
  FIRST_CALCULATOR_USE: 15,
  FIRST_SIMULATOR_USE: 20,
} as const

/**
 * Calculate XP for quiz completion based on score and attempts
 */
export function calculateQuizXP(score: number, attempts: number): number {
  let xp: number = XP_REWARDS.QUIZ_ATTEMPT

  if (score >= 1.0) {
    // Perfect score
    xp = XP_REWARDS.QUIZ_PERFECT
    if (attempts === 1) {
      xp += XP_REWARDS.FIRST_TRY_BONUS
    }
  } else if (score >= 0.7) {
    // Passing score
    xp = XP_REWARDS.QUIZ_PASS
  }

  return xp
}

/**
 * Calculate level from total XP
 */
export function calculateLevel(totalXP: number): number {
  // Level formula: Each level requires 100 more XP
  // Level 1: 0-99 XP
  // Level 2: 100-199 XP
  // Level 3: 200-299 XP, etc.
  return Math.floor(totalXP / 100) + 1
}

/**
 * Calculate XP needed for next level
 */
export function calculateXPToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP)
  const nextLevelThreshold = currentLevel * 100
  return nextLevelThreshold - totalXP
}

/**
 * Calculate progress percentage within current level
 */
export function calculateLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP)
  const xpForCurrentLevel = (currentLevel - 1) * 100
  const xpInCurrentLevel = totalXP - xpForCurrentLevel
  return (xpInCurrentLevel / 100) * 100
}

/**
 * Get level title/badge
 */
export function getLevelTitle(level: number): {
  title: string
  badge: string
  color: string
} {
  if (level >= 50) {
    return { title: 'Maestro', badge: '🏆', color: 'text-yellow-500' }
  } else if (level >= 30) {
    return { title: 'Experto', badge: '💎', color: 'text-purple-500' }
  } else if (level >= 20) {
    return { title: 'Avanzado', badge: '⭐', color: 'text-blue-500' }
  } else if (level >= 10) {
    return { title: 'Intermedio', badge: '📚', color: 'text-green-500' }
  } else if (level >= 5) {
    return { title: 'Aprendiz', badge: '🎓', color: 'text-cyan-500' }
  } else {
    return { title: 'Novato', badge: '🌱', color: 'text-gray-500' }
  }
}

/**
 * Calculate streak bonus multiplier
 */
export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 2.0 // 2x multiplier
  if (streakDays >= 14) return 1.5
  if (streakDays >= 7) return 1.25
  if (streakDays >= 3) return 1.1
  return 1.0 // No multiplier
}

/**
 * Apply streak multiplier to XP reward
 */
export function applyStreakBonus(baseXP: number, streakDays: number): number {
  const multiplier = getStreakMultiplier(streakDays)
  return Math.floor(baseXP * multiplier)
}

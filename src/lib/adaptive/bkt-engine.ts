/**
 * Bayesian Knowledge Tracing (BKT) Engine
 *
 * BKT models student knowledge as a binary latent variable (known/unknown)
 * and updates the probability of mastery based on student responses.
 *
 * Parameters:
 * - P(L0): Initial probability of knowledge (before any practice)
 * - P(T): Probability of learning (transition from unknown to known)
 * - P(S): Probability of slip (answering incorrectly despite knowing)
 * - P(G): Probability of guess (answering correctly despite not knowing)
 */

export interface BKTParameters {
  pL0: number // Initial knowledge probability
  pT: number  // Learning rate
  pS: number  // Slip probability
  pG: number  // Guess probability
}

export interface StudentKnowledge {
  conceptId: string
  pLn: number // Current probability of knowledge
  attempts: number
  correctAnswers: number
  lastUpdated: Date
}

// Default BKT parameters (tuned for educational gaming context)
export const DEFAULT_BKT_PARAMS: BKTParameters = {
  pL0: 0.1,  // 10% chance student already knows concept
  pT: 0.15,  // 15% chance of learning per correct practice
  pS: 0.1,   // 10% chance of slip (careless error)
  pG: 0.25   // 25% chance of guessing correctly (4 options = 25%)
}

/**
 * Calculate P(Ln | evidence) using Bayes' Theorem
 *
 * If answer is correct:
 *   P(Ln | correct) = P(Ln-1) * (1 - P(S)) /
 *                     [P(Ln-1) * (1 - P(S)) + (1 - P(Ln-1)) * P(G)]
 *
 * If answer is incorrect:
 *   P(Ln | incorrect) = P(Ln-1) * P(S) /
 *                       [P(Ln-1) * P(S) + (1 - P(Ln-1)) * (1 - P(G))]
 *
 * Then update for learning:
 *   P(Ln) = P(Ln | evidence) + (1 - P(Ln | evidence)) * P(T)
 */
export function updateKnowledge(
  pLn: number,
  isCorrect: boolean,
  params: BKTParameters = DEFAULT_BKT_PARAMS
): number {
  const { pT, pS, pG } = params

  let pLnGivenEvidence: number

  if (isCorrect) {
    // Student answered correctly
    const numerator = pLn * (1 - pS)
    const denominator = pLn * (1 - pS) + (1 - pLn) * pG
    pLnGivenEvidence = numerator / denominator
  } else {
    // Student answered incorrectly
    const numerator = pLn * pS
    const denominator = pLn * pS + (1 - pLn) * (1 - pG)
    pLnGivenEvidence = numerator / denominator
  }

  // Account for learning opportunity
  const newPLn = pLnGivenEvidence + (1 - pLnGivenEvidence) * pT

  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, newPLn))
}

/**
 * Initialize student knowledge for a new concept
 */
export function initializeKnowledge(conceptId: string, params: BKTParameters = DEFAULT_BKT_PARAMS): StudentKnowledge {
  return {
    conceptId,
    pLn: params.pL0,
    attempts: 0,
    correctAnswers: 0,
    lastUpdated: new Date()
  }
}

/**
 * Update student knowledge based on answer
 */
export function recordAnswer(
  knowledge: StudentKnowledge,
  isCorrect: boolean,
  params: BKTParameters = DEFAULT_BKT_PARAMS
): StudentKnowledge {
  const newPLn = updateKnowledge(knowledge.pLn, isCorrect, params)

  return {
    ...knowledge,
    pLn: newPLn,
    attempts: knowledge.attempts + 1,
    correctAnswers: knowledge.correctAnswers + (isCorrect ? 1 : 0),
    lastUpdated: new Date()
  }
}

/**
 * Determine if student has mastered a concept
 * Threshold typically set at 0.95 (95% confidence)
 */
export function hasMastered(knowledge: StudentKnowledge, threshold: number = 0.95): boolean {
  return knowledge.pLn >= threshold && knowledge.attempts >= 3
}

/**
 * Get recommended difficulty level based on knowledge state
 * - Below 0.3: Easy questions
 * - 0.3 - 0.6: Medium questions
 * - 0.6 - 0.85: Hard questions
 * - Above 0.85: Expert questions
 */
export type DifficultyLevel = "easy" | "medium" | "hard" | "expert"

export function getRecommendedDifficulty(knowledge: StudentKnowledge): DifficultyLevel {
  if (knowledge.pLn < 0.3) return "easy"
  if (knowledge.pLn < 0.6) return "medium"
  if (knowledge.pLn < 0.85) return "hard"
  return "expert"
}

/**
 * Calculate optimal practice time using spaced repetition
 * Based on SuperMemo SM-2 algorithm
 */
export function getNextReviewDate(knowledge: StudentKnowledge): Date {
  const baseInterval = 1 // 1 day
  const easeFactor = 1.3 + (knowledge.pLn * 1.7) // 1.3 to 3.0 based on mastery

  // Calculate interval based on consecutive correct answers
  const accuracy = knowledge.attempts > 0 ? knowledge.correctAnswers / knowledge.attempts : 0
  let interval: number

  if (accuracy >= 0.9 && knowledge.attempts >= 3) {
    // High accuracy: longer interval
    interval = baseInterval * Math.pow(easeFactor, knowledge.attempts / 3)
  } else if (accuracy >= 0.6) {
    // Medium accuracy: moderate interval
    interval = baseInterval * 2
  } else {
    // Low accuracy: short interval
    interval = baseInterval
  }

  // Cap at 30 days
  interval = Math.min(interval, 30)

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + Math.ceil(interval))

  return nextReview
}

/**
 * Predict probability of correct answer on next attempt
 */
export function predictCorrectness(knowledge: StudentKnowledge, params: BKTParameters = DEFAULT_BKT_PARAMS): number {
  const { pS, pG } = params
  return knowledge.pLn * (1 - pS) + (1 - knowledge.pLn) * pG
}

/**
 * Get learning insights for educators/students
 */
export interface LearningInsight {
  status: "struggling" | "learning" | "proficient" | "mastered"
  confidence: number
  recommendation: string
  estimatedAttemptsToMastery: number
}

export function getLearningInsights(knowledge: StudentKnowledge): LearningInsight {
  const { pLn, attempts } = knowledge

  let status: LearningInsight["status"]
  let recommendation: string

  if (pLn >= 0.95) {
    status = "mastered"
    recommendation = "¡Excelente! Has dominado este concepto. Continúa con temas más avanzados."
  } else if (pLn >= 0.7) {
    status = "proficient"
    recommendation = "Buen progreso. Practica algunos problemas más difíciles para solidificar tu conocimiento."
  } else if (pLn >= 0.3) {
    status = "learning"
    recommendation = "Vas por buen camino. Continúa practicando para mejorar tu comprensión."
  } else {
    status = "struggling"
    recommendation = "Necesitas más práctica en este tema. Considera revisar el material de fundamentos."
  }

  // Estimate attempts to reach mastery (95%)
  const targetPLn = 0.95
  const avgLearningRate = 0.15 // Average P(T)
  const currentGap = targetPLn - pLn
  const estimatedAttempts = Math.ceil(currentGap / avgLearningRate)

  return {
    status,
    confidence: pLn,
    recommendation,
    estimatedAttemptsToMastery: Math.max(0, estimatedAttempts)
  }
}

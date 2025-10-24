/**
 * Quiz Generation System
 * Generates personalized quizzes using OpenAI and stores them in Supabase
 */

import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

// Schema for quiz questions
const QuestionSchema = z.object({
  question: z.string().describe('The question text'),
  options: z.array(z.string()).length(4).describe('Four multiple choice options'),
  correct_answer: z.number().min(0).max(3).describe('Index of the correct answer (0-3)'),
  explanation: z.string().describe('Explanation of why the answer is correct'),
  blooms_level: z.enum(['remember', 'understand', 'apply', 'analyze']).describe('Blooms taxonomy level'),
})

const QuizSchema = z.object({
  questions: z.array(QuestionSchema).min(5).max(10).describe('Array of 5-10 quiz questions'),
})

export type QuizQuestion = z.infer<typeof QuestionSchema>
export type GeneratedQuiz = z.infer<typeof QuizSchema>

/**
 * Generate a quiz on a specific topic
 */
export async function generateQuiz(
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  numberOfQuestions: number = 5
): Promise<GeneratedQuiz> {
  const levelDescriptions = {
    beginner: 'conceptos básicos y fundamentales',
    intermediate: 'aplicación práctica y análisis',
    advanced: 'análisis profundo y síntesis avanzada',
  }

  const prompt = `Eres un experto en educación sobre juego responsable. Genera un quiz educativo sobre "${topic}"
  con ${numberOfQuestions} preguntas de opción múltiple.

  Nivel de dificultad: ${level} (enfocado en ${levelDescriptions[level]})

  Contexto educativo:
  - El quiz es sobre juego responsable, probabilidad, valor esperado o gestión de bankroll
  - Las preguntas deben ser claras, educativas y progresivas en dificultad
  - Cada pregunta debe tener 4 opciones, con solo una correcta
  - Incluye explicaciones detalladas para cada respuesta
  - Usa la taxonomía de Bloom para clasificar las preguntas

  Formato de las preguntas:
  - Mezcla preguntas teóricas con aplicaciones prácticas
  - Incluye cálculos cuando sea apropiado
  - Evita ambigüedades
  - Asegúrate de que las respuestas incorrectas sean plausibles pero claramente equivocadas`

  const { object: quiz } = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: QuizSchema,
    prompt,
  })

  return quiz
}

/**
 * Save a quiz to the database
 */
export async function saveQuiz(
  userId: string,
  topic: string,
  bloomsLevel: string,
  questions: QuizQuestion[]
): Promise<string> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      user_id: userId,
      topic,
      blooms_level: bloomsLevel,
      questions: questions as unknown as string,
    })
    .select('id')
    .single()

  if (error) {
    logger.error('Error saving quiz:', error)
    throw new Error('Failed to save quiz')
  }

  return data.id
}

/**
 * Get a quiz by ID
 */
export async function getQuiz(quizId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single()

  if (error) {
    logger.error('Error loading quiz:', error)
    return null
  }

  return data
}

/**
 * Save a quiz attempt
 */
export async function saveQuizAttempt(
  userId: string,
  quizId: string,
  answers: number[],
  evaluations: Array<{ correct: boolean; explanation: string }>,
  score: number
): Promise<string> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_id: quizId,
      answers: answers as unknown as string,
      evaluations: evaluations as unknown as string,
      score,
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    logger.error('Error saving quiz attempt:', error)
    throw new Error('Failed to save quiz attempt')
  }

  return data.id
}

/**
 * Evaluate quiz answers
 */
export function evaluateQuiz(
  questions: QuizQuestion[],
  userAnswers: number[]
): {
  score: number
  evaluations: Array<{ correct: boolean; explanation: string }>
} {
  let correctCount = 0
  const evaluations = questions.map((question, index) => {
    const userAnswer = userAnswers[index]
    const isCorrect = userAnswer === question.correct_answer

    if (isCorrect) {
      correctCount++
    }

    return {
      correct: isCorrect,
      explanation: question.explanation,
    }
  })

  const score = correctCount / questions.length

  return {
    score,
    evaluations,
  }
}

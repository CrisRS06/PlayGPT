/**
 * Quiz Submission API Endpoint
 * Evaluates user answers and saves the attempt
 */

import { NextRequest, NextResponse } from 'next/server'
import { getQuiz, evaluateQuiz, saveQuizAttempt, type QuizQuestion } from '@/lib/quiz/quiz-generator'
import { getUser } from '@/lib/auth/actions'
import { updateKnowledgeFromQuiz, logInteraction } from '@/lib/knowledge/knowledge-tracker'
import { quizSubmissionRateLimiter, getRateLimitIdentifier, createRateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit'
import { logger } from '@/lib/utils/logger'

export const runtime = 'nodejs'

interface SubmitQuizRequest {
  answers: number[]
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    // Check authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const identifier = getRateLimitIdentifier(req, user.id)
    const rateLimitResult = await quizSubmissionRateLimiter.check(identifier)

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult)
    }

    const { quizId } = await params
    const { answers }: SubmitQuizRequest = await req.json()

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 })
    }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 })
    }

    // Get the quiz
    const quiz = await getQuiz(quizId)

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Verify the quiz belongs to the user
    if (quiz.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const questions = quiz.questions as unknown as QuizQuestion[]

    // Validate number of answers
    if (answers.length !== questions.length) {
      return NextResponse.json(
        { error: 'Number of answers does not match number of questions' },
        { status: 400 }
      )
    }

    // Evaluate the quiz
    const { score, evaluations } = evaluateQuiz(questions, answers)

    // Save the attempt
    const attemptId = await saveQuizAttempt(
      user.id,
      quizId,
      answers,
      evaluations,
      score
    )

    logger.info(`✅ Quiz attempt saved: ${attemptId} - Score: ${(score * 100).toFixed(0)}%`)

    // Update knowledge components based on quiz performance
    await updateKnowledgeFromQuiz(
      user.id,
      quiz.topic,
      score,
      quiz.blooms_level
    )

    // Log the interaction
    await logInteraction(user.id, 'quiz', {
      quizId,
      topic: quiz.topic,
      score,
      correctAnswers: evaluations.filter((e) => e.correct).length,
      totalQuestions: questions.length,
    })

    logger.info(`📊 Knowledge components updated for user ${user.id}`)

    const response = NextResponse.json({
      attemptId,
      score,
      evaluations,
      correctAnswers: evaluations.filter((e) => e.correct).length,
      totalQuestions: questions.length,
    })

    // Add rate limit headers
    addRateLimitHeaders(response.headers, rateLimitResult)

    return response
  } catch (error) {
    logger.error('❌ Error submitting quiz:', error)

    return NextResponse.json(
      {
        error: 'Failed to submit quiz',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * Quiz Generation API Endpoint
 * Generates a new quiz on a specific topic using AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateQuiz, saveQuiz } from '@/lib/quiz/quiz-generator'
import { getUser } from '@/lib/auth/actions'
import { quizGenerationRateLimiter, getRateLimitIdentifier, createRateLimitResponse, addRateLimitHeaders } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 30

interface GenerateQuizRequest {
  topic: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  numberOfQuestions?: number
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const identifier = getRateLimitIdentifier(req, user.id)
    const rateLimitResult = await quizGenerationRateLimiter.check(identifier)

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult)
    }

    const { topic, level = 'beginner', numberOfQuestions = 5 }: GenerateQuizRequest =
      await req.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    if (numberOfQuestions < 3 || numberOfQuestions > 10) {
      return NextResponse.json(
        { error: 'Number of questions must be between 3 and 10' },
        { status: 400 }
      )
    }

    console.log(`📝 Generating quiz on "${topic}" for user ${user.id}`)

    // Generate quiz with AI
    const quiz = await generateQuiz(topic, level, numberOfQuestions)

    // Determine blooms level from questions
    const bloomsLevel = quiz.questions[0]?.blooms_level || 'understand'

    // Save quiz to database
    const quizId = await saveQuiz(user.id, topic, bloomsLevel, quiz.questions)

    console.log(`✅ Quiz generated successfully with ID: ${quizId}`)

    const response = NextResponse.json({
      quizId,
      topic,
      level,
      numberOfQuestions: quiz.questions.length,
    })

    // Add rate limit headers
    addRateLimitHeaders(response.headers, rateLimitResult)

    return response
  } catch (error) {
    console.error('❌ Error generating quiz:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate quiz',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

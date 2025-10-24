/**
 * Quiz Retrieval API Endpoint
 * Gets a specific quiz by ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { getQuiz } from '@/lib/quiz/quiz-generator'
import { getUser } from '@/lib/auth/actions'
import { logger } from '@/lib/utils/logger'

export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    // Check authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quizId } = await params

    if (!quizId) {
      return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 })
    }

    const quiz = await getQuiz(quizId)

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Verify the quiz belongs to the user
    if (quiz.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    logger.error('❌ Error retrieving quiz:', error)

    return NextResponse.json(
      {
        error: 'Failed to retrieve quiz',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

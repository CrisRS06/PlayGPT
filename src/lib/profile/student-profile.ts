/**
 * Student Profile Management
 * Handles fetching and updating student profiles
 */

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/utils/logger'

export interface StudentProfile {
  id: string
  user_id: string
  level: 'beginner' | 'intermediate' | 'advanced'
  learning_style: 'visual' | 'verbal' | 'active' | 'intuitive'
  current_module: string
  strengths: string[]
  weaknesses: string[]
  knowledge_components: Record<string, number>
  created_at: string
  updated_at: string
}

/**
 * Get student profile by user ID
 */
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    logger.error('Error loading student profile:', error)
    return null
  }

  return data as unknown as StudentProfile
}

/**
 * Update student profile
 */
export async function updateStudentProfile(
  userId: string,
  updates: Partial<Omit<StudentProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('student_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) {
    logger.error('Error updating student profile:', error)
    return false
  }

  return true
}

/**
 * Get knowledge components mastery for a user
 */
export async function getKnowledgeComponents(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('knowledge_components')
    .select('*')
    .eq('user_id', userId)
    .order('mastery_level', { ascending: false })

  if (error) {
    logger.error('Error loading knowledge components:', error)
    return []
  }

  return data
}

/**
 * Get user's quiz attempts
 */
export async function getQuizAttempts(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(10)

  if (error) {
    logger.error('Error loading quiz attempts:', error)
    return []
  }

  return data
}

/**
 * Get user's interaction stats
 */
export async function getInteractionStats(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('interactions')
    .select('interaction_type, created_at, tokens_used, cost_usd')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    logger.error('Error loading interaction stats:', error)
    return {
      total_interactions: 0,
      total_tokens: 0,
      total_cost: 0,
      interactions_by_type: {},
    }
  }

  const totalInteractions = data.length
  const totalTokens = data.reduce((sum, i) => sum + (i.tokens_used || 0), 0)
  const totalCost = data.reduce((sum, i) => sum + (i.cost_usd || 0), 0)

  const interactionsByType = data.reduce(
    (acc, i) => {
      acc[i.interaction_type] = (acc[i.interaction_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return {
    total_interactions: totalInteractions,
    total_tokens: totalTokens,
    total_cost: totalCost,
    interactions_by_type: interactionsByType,
  }
}

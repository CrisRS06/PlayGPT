/**
 * Knowledge Component Tracking
 * Automatically updates mastery levels based on quiz performance
 */

import { createClient } from '@/lib/supabase/server'

export interface KnowledgeComponent {
  component_name: string
  mastery_level: number
  attempts: number
}

/**
 * Update knowledge components based on quiz results
 * Uses a simplified BKT (Bayesian Knowledge Tracing) approach
 */
export async function updateKnowledgeFromQuiz(
  userId: string,
  topic: string,
  score: number,
  bloomsLevel: string
): Promise<void> {
  const supabase = await createClient()

  // Extract potential component names from the topic
  const components = extractComponents(topic, bloomsLevel)

  for (const componentName of components) {
    // Get existing mastery level
    const { data: existing } = await supabase
      .from('knowledge_components')
      .select('*')
      .eq('user_id', userId)
      .eq('component_name', componentName)
      .single()

    if (existing) {
      // Update existing component using BKT-inspired formula
      const currentMastery = existing.mastery_level || 0
      const attempts = (existing.attempts || 0) + 1

      // Learning rate: how quickly the student learns (0.3)
      const learningRate = 0.3
      // Slip rate: chance of making a mistake even when knowing (0.1)
      const slipRate = 0.1
      // Guess rate: chance of guessing correctly (0.25 for 4 options)
      const guessRate = 0.25

      // Update mastery based on performance
      let newMastery: number
      if (score >= 0.7) {
        // Correct answer - increase mastery
        newMastery =
          currentMastery +
          (1 - currentMastery) * learningRate * (1 - slipRate) * score
      } else {
        // Incorrect answer - slight decrease
        newMastery = currentMastery * (1 - guessRate) * (1 - score)
      }

      // Ensure mastery is between 0 and 1
      newMastery = Math.max(0, Math.min(1, newMastery))

      await supabase
        .from('knowledge_components')
        .update({
          mastery_level: newMastery,
          attempts,
          last_practiced: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('component_name', componentName)
    } else {
      // Create new component
      const initialMastery = score * 0.5 // Start at 50% of quiz score

      await supabase.from('knowledge_components').insert({
        user_id: userId,
        component_name: componentName,
        mastery_level: initialMastery,
        attempts: 1,
        last_practiced: new Date().toISOString(),
      })
    }
  }

  // Also update student profile with strengths and weaknesses
  await updateStudentProfile(userId)
}

/**
 * Extract knowledge components from topic
 */
function extractComponents(topic: string, bloomsLevel: string): string[] {
  const components: string[] = []

  // Map topics to knowledge components
  const topicMappings: Record<string, string[]> = {
    'Valor Esperado': ['Valor Esperado', 'Cálculo de Probabilidades'],
    'Probabilidad Básica': [
      'Probabilidad Básica',
      'Eventos Independientes',
      'Distribuciones',
    ],
    'Sesgos Cognitivos': [
      'Sesgos Cognitivos',
      'Gamblers Fallacy',
      'Toma de Decisiones',
    ],
    'Gestión de Bankroll': ['Gestión de Bankroll', 'Kelly Criterion'],
    'Kelly Criterion': ['Kelly Criterion', 'Gestión de Bankroll'],
    'Varianza': ['Varianza y Desviación Estándar'],
    'Toma de Decisiones': ['Toma de Decisiones', 'Análisis de Riesgos'],
  }

  // Find matching components
  for (const [key, values] of Object.entries(topicMappings)) {
    if (topic.includes(key)) {
      components.push(...values)
    }
  }

  // If no match, use the topic itself
  if (components.length === 0) {
    components.push(topic)
  }

  // Add blooms level to component names for more granular tracking
  return components.map((c) => `${c} (${bloomsLevel})`)
}

/**
 * Update student profile with current strengths and weaknesses
 */
async function updateStudentProfile(userId: string): Promise<void> {
  const supabase = await createClient()

  // Get all knowledge components
  const { data: components } = await supabase
    .from('knowledge_components')
    .select('*')
    .eq('user_id', userId)

  if (!components || components.length === 0) return

  // Identify strengths (mastery >= 0.8)
  const strengths = components
    .filter((c) => (c.mastery_level || 0) >= 0.8)
    .map((c) => c.component_name)
    .slice(0, 10) // Top 10

  // Identify weaknesses (mastery < 0.5 and attempted at least twice)
  const weaknesses = components
    .filter((c) => (c.mastery_level || 0) < 0.5 && (c.attempts || 0) >= 2)
    .map((c) => c.component_name)
    .slice(0, 10) // Top 10

  // Calculate knowledge components object
  const knowledgeComponents = components.reduce(
    (acc, c) => {
      acc[c.component_name] = c.mastery_level || 0
      return acc
    },
    {} as Record<string, number>
  )

  // Update profile
  await supabase
    .from('student_profiles')
    .update({
      strengths,
      weaknesses,
      knowledge_components: knowledgeComponents as unknown as string,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
}

/**
 * Log an interaction for analytics
 */
export async function logInteraction(
  userId: string,
  interactionType: string,
  content: Record<string, unknown>,
  tokensUsed?: number,
  costUsd?: number
): Promise<void> {
  const supabase = await createClient()

  await supabase.from('interactions').insert({
    user_id: userId,
    interaction_type: interactionType,
    content: content as unknown as string,
    tokens_used: tokensUsed,
    cost_usd: costUsd,
    created_at: new Date().toISOString(),
  })
}

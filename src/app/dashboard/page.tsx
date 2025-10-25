import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const supabase = await createServerClient()

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Fetch student profile
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Fetch knowledge components with mastery tracking
  const { data: knowledgeComponents } = await supabase
    .from("knowledge_components")
    .select("component_name, mastery_level, attempts, last_practiced")
    .eq("user_id", user.id)
    .order("mastery_level", { ascending: false })

  // Fetch quiz attempts
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("score, completed_at, quiz_id")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(20)

  // Fetch interaction statistics
  const { data: interactions } = await supabase
    .from("interactions")
    .select("interaction_type, tokens_used, cost_usd")
    .eq("user_id", user.id)

  // Calculate interaction stats
  const interactionStats = {
    total_interactions: interactions?.length || 0,
    total_tokens: interactions?.reduce((sum, i) => sum + (i.tokens_used || 0), 0) || 0,
    total_cost: interactions?.reduce((sum, i) => sum + (i.cost_usd || 0), 0) || 0,
    interactions_by_type: interactions?.reduce((acc, i) => {
      acc[i.interaction_type] = (acc[i.interaction_type] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}
  }

  return (
    <DashboardClient
      user={user}
      profile={profile}
      knowledgeComponents={knowledgeComponents || []}
      quizAttempts={quizAttempts || []}
      interactionStats={interactionStats}
    />
  )
}

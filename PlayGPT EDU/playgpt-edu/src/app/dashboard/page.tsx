import { getUser } from "@/lib/auth/actions"
import { getStudentProfile, getKnowledgeComponents, getQuizAttempts, getInteractionStats } from "@/lib/profile/student-profile"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Load all data
  const [profile, knowledgeComponents, quizAttempts, interactionStats] = await Promise.all([
    getStudentProfile(user.id),
    getKnowledgeComponents(user.id),
    getQuizAttempts(user.id),
    getInteractionStats(user.id),
  ])

  return (
    <DashboardClient
      user={user}
      profile={profile}
      knowledgeComponents={knowledgeComponents}
      quizAttempts={quizAttempts}
      interactionStats={interactionStats}
    />
  )
}

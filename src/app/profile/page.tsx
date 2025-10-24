import { getUser } from "@/lib/auth/actions"
import { getStudentProfile, getKnowledgeComponents, getQuizAttempts, getInteractionStats } from "@/lib/profile/student-profile"
import { redirect } from "next/navigation"
import { ProfileClient } from "@/components/profile/ProfileClient"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Load all profile data in parallel
  const [profile, knowledgeComponents, quizAttempts, interactionStats] = await Promise.all([
    getStudentProfile(user.id),
    getKnowledgeComponents(user.id),
    getQuizAttempts(user.id),
    getInteractionStats(user.id),
  ])

  return (
    <ProfileClient
      user={user}
      profile={profile}
      knowledgeComponents={knowledgeComponents}
      quizAttempts={quizAttempts}
      interactionStats={interactionStats}
    />
  )
}

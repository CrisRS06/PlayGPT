"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, Brain, Trophy, TrendingUp, MessageSquare, Target } from "lucide-react"
import type { StudentProfile } from "@/lib/profile/student-profile"

interface ProfileClientProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
  profile: StudentProfile | null
  knowledgeComponents: Array<{
    component_name: string
    mastery_level: number | null
    attempts: number | null
    last_practiced: string | null
  }>
  quizAttempts: Array<{
    score: number
    completed_at: string | null
    quiz_id: string
  }>
  interactionStats: {
    total_interactions: number
    total_tokens: number
    total_cost: number
    interactions_by_type: Record<string, number>
  }
}

const levelColors = {
  beginner: "from-green-500 to-emerald-500",
  intermediate: "from-blue-500 to-cyan-500",
  advanced: "from-purple-500 to-pink-500",
}

const levelLabels = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
}

const learningStyleLabels = {
  visual: "Visual",
  verbal: "Verbal",
  active: "Activo",
  intuitive: "Intuitivo",
}

export function ProfileClient({
  user,
  profile,
  knowledgeComponents,
  quizAttempts,
  interactionStats,
}: ProfileClientProps) {
  const averageQuizScore =
    quizAttempts.length > 0
      ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
        quizAttempts.length
      : 0

  const masteredComponents = knowledgeComponents.filter(
    (kc) => (kc.mastery_level || 0) >= 0.8
  ).length

  return (
    <div className="min-h-screen bg-black text-text-primary >
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild aria-label="Volver al chat">
              <Link href="/chat">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary >Mi Perfil</h1>
              <p className="text-sm text-text-secondary">
                Gestiona tu información y visualiza tu progreso
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <User className="w-8 h-8 text-text-primary  />
                    </div>
                    <div>
                      <CardTitle className="text-text-primary >
                        {user.user_metadata?.full_name || "Usuario"}
                      </CardTitle>
                      <p className="text-sm text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile && (
                    <>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">Nivel</p>
                        <Badge
                          className={`bg-gradient-to-r ${
                            levelColors[profile.level]
                          } text-text-primary border-0`}
                        >
                          {levelLabels[profile.level]}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">
                          Estilo de Aprendizaje
                        </p>
                        <Badge variant="outline" className="border-primary/30 text-text-primary >
                          {learningStyleLabels[profile.learning_style]}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary mb-2">
                          Módulo Actual
                        </p>
                        <p className="text-sm text-text-primary font-medium">
                          {profile.current_module.replace(/_/g, " ")}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-text-primary flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    Estadísticas Generales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Interacciones
                    </span>
                    <span className="text-lg font-bold text-text-primary >
                      {interactionStats.total_interactions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Conceptos Dominados
                    </span>
                    <span className="text-lg font-bold text-text-primary >
                      {masteredComponents}/{knowledgeComponents.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Promedio Quizzes
                    </span>
                    <span className="text-lg font-bold text-text-primary >
                      {(averageQuizScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      Quizzes Completados
                    </span>
                    <span className="text-lg font-bold text-text-primary >
                      {quizAttempts.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Knowledge & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Knowledge Components */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-text-primary flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Dominio de Conceptos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {knowledgeComponents.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                      <p className="text-text-secondary">
                        Aún no has practicado ningún concepto
                      </p>
                      <p className="text-sm text-text-tertiary mt-2">
                        Comienza a chatear o toma un quiz para empezar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {knowledgeComponents.slice(0, 10).map((kc, index) => (
                        <div key={kc.component_name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-text-primary >
                              {kc.component_name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-text-secondary">
                                {kc.attempts || 0} intentos
                              </span>
                              <span className="text-sm font-bold text-text-primary >
                                {((kc.mastery_level || 0) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(kc.mastery_level || 0) * 100}%`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full rounded-full ${
                                (kc.mastery_level || 0) >= 0.8
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : (kc.mastery_level || 0) >= 0.5
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                    : "bg-gradient-to-r from-orange-500 to-red-500"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Quiz Attempts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-text-primary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Quizzes Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quizAttempts.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                      <p className="text-text-secondary">
                        Aún no has completado ningún quiz
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/quizzes">Tomar un Quiz</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quizAttempts.slice(0, 5).map((attempt, index) => (
                        <div
                          key={attempt.quiz_id || `attempt-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-text-primary >
                              Quiz {index + 1}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {attempt.completed_at
                                ? new Date(attempt.completed_at).toLocaleDateString("es-ES")
                                : "Fecha no disponible"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${
                                attempt.score >= 0.8
                                  ? "text-success"
                                  : attempt.score >= 0.6
                                    ? "text-info"
                                    : "text-streak-orange"
                              }`}
                            >
                              {(attempt.score * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

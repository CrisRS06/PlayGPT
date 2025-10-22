"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Brain, Target, MessageSquare, Trophy, Calendar } from "lucide-react"
import type { StudentProfile } from "@/lib/profile/student-profile"

interface DashboardClientProps {
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

export function DashboardClient({
  knowledgeComponents,
  quizAttempts,
  interactionStats,
}: DashboardClientProps) {
  // Calculate progress metrics
  const averageScore = quizAttempts.length > 0
    ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length
    : 0

  const masteredComponents = knowledgeComponents.filter((kc) => (kc.mastery_level || 0) >= 0.8).length
  const averageMastery = knowledgeComponents.length > 0
    ? knowledgeComponents.reduce((sum, kc) => sum + (kc.mastery_level || 0), 0) / knowledgeComponents.length
    : 0

  // Get recent quiz trend (last 5 quizzes)
  const recentQuizzes = quizAttempts.slice(0, 5).reverse()

  return (
    <div className="min-h-screen bg-black text-white">
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
              <h1 className="text-2xl font-bold text-white">Dashboard de Progreso</h1>
              <p className="text-sm text-gray-400">
                Visualiza tu evolución y métricas de aprendizaje
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-white/10 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Quizzes Completados</p>
                    <p className="text-3xl font-bold text-white">{quizAttempts.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-white/10 bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Promedio de Calificación</p>
                    <p className="text-3xl font-bold text-white">
                      {(averageScore * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-white/10 bg-gradient-to-br from-green-500/20 to-green-500/5 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Conceptos Dominados</p>
                    <p className="text-3xl font-bold text-white">
                      {masteredComponents}/{knowledgeComponents.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-white/10 bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Interacciones</p>
                    <p className="text-3xl font-bold text-white">
                      {interactionStats.total_interactions}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quiz Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Progreso en Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentQuizzes.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>Aún no has completado ningún quiz</p>
                    <Button className="mt-4" asChild>
                      <Link href="/quizzes">Tomar un Quiz</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="h-48 flex items-end justify-between gap-2">
                      {recentQuizzes.map((quiz, index) => {
                        const height = quiz.score * 100
                        const color =
                          quiz.score >= 0.8
                            ? "from-green-500 to-emerald-500"
                            : quiz.score >= 0.6
                              ? "from-blue-500 to-cyan-500"
                              : "from-orange-500 to-red-500"

                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="relative w-full group">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`w-full bg-gradient-to-t ${color} rounded-t-lg min-h-[20px] cursor-pointer group-hover:opacity-80 transition-opacity`}
                              />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                                {(quiz.score * 100).toFixed(0)}%
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              #{recentQuizzes.length - index}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 text-center">
                        Últimos {recentQuizzes.length} quizzes completados
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mastery Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Dominio de Conceptos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {knowledgeComponents.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p>Aún no has practicado ningún concepto</p>
                    <Button className="mt-4" asChild>
                      <Link href="/quizzes">Comenzar a Practicar</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Overall Mastery */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Dominio General</span>
                        <span className="text-sm font-bold text-white">
                          {(averageMastery * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${averageMastery * 100}%` }}
                          transition={{ duration: 1 }}
                          className={`h-full rounded-full ${
                            averageMastery >= 0.8
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : averageMastery >= 0.5
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                                : "bg-gradient-to-r from-orange-500 to-red-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Top 5 Concepts */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-400">Top 5 Conceptos</h4>
                      {knowledgeComponents.slice(0, 5).map((kc, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white truncate">
                              {kc.component_name}
                            </span>
                            <span className="text-gray-400 ml-2">
                              {((kc.mastery_level || 0) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(kc.mastery_level || 0) * 100}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
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
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 grid sm:grid-cols-3 gap-4"
        >
          <Button variant="outline" asChild className="h-auto p-6">
            <Link href="/quizzes">
              <div className="flex flex-col items-center gap-2">
                <Trophy className="h-8 w-8" />
                <span className="font-semibold">Tomar un Quiz</span>
              </div>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto p-6">
            <Link href="/chat">
              <div className="flex flex-col items-center gap-2">
                <MessageSquare className="h-8 w-8" />
                <span className="font-semibold">Chatear con IA</span>
              </div>
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-auto p-6">
            <Link href="/profile">
              <div className="flex flex-col items-center gap-2">
                <Brain className="h-8 w-8" />
                <span className="font-semibold">Ver Mi Perfil</span>
              </div>
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

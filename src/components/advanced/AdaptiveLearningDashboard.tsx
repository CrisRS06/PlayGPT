"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, TrendingUp, Target, Zap, AlertCircle, CheckCircle2, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  initializeKnowledge,
  recordAnswer,
  getRecommendedDifficulty,
  getLearningInsights,
  getNextReviewDate,
  predictCorrectness,
  hasMastered,
  type StudentKnowledge,
  type DifficultyLevel
} from "@/lib/adaptive/bkt-engine"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface AdaptiveLearningDashboardProps {
  conceptId: string
  conceptName: string
}

export function AdaptiveLearningDashboard({ conceptId, conceptName }: AdaptiveLearningDashboardProps) {
  const [knowledge, setKnowledge] = useState<StudentKnowledge>(() =>
    initializeKnowledge(conceptId)
  )
  const [history, setHistory] = useState<Array<{ attempt: number; pLn: number }>>([
    { attempt: 0, pLn: knowledge.pLn }
  ])

  const insights = getLearningInsights(knowledge)
  const difficulty = getRecommendedDifficulty(knowledge)
  const nextReview = getNextReviewDate(knowledge)
  const predictedSuccess = predictCorrectness(knowledge)
  const isMastered = hasMastered(knowledge)

  const handleAnswer = (isCorrect: boolean) => {
    const updated = recordAnswer(knowledge, isCorrect)
    setKnowledge(updated)
    setHistory(prev => [...prev, { attempt: updated.attempts, pLn: updated.pLn }])
  }

  const getDifficultyConfig = (level: DifficultyLevel) => {
    switch (level) {
      case "easy":
        return {
          label: "Fácil",
          color: "bg-green-500/10 text-success border-green-500/20",
          description: "Preguntas básicas para construir fundamentos"
        }
      case "medium":
        return {
          label: "Medio",
          color: "bg-blue-500/10 text-info border-blue-500/20",
          description: "Preguntas de dificultad moderada"
        }
      case "hard":
        return {
          label: "Difícil",
          color: "bg-orange-500/10 text-streak-orange border-orange-500/20",
          description: "Preguntas desafiantes para expertos"
        }
      case "expert":
        return {
          label: "Experto",
          color: "bg-purple-500/10 text-icon-primary border-purple-500/20",
          description: "Preguntas de nivel avanzado"
        }
    }
  }

  const getStatusConfig = (status: typeof insights.status) => {
    switch (status) {
      case "struggling":
        return {
          icon: AlertCircle,
          color: "text-error",
          bg: "bg-red-500/10",
          border: "border-red-500/20"
        }
      case "learning":
        return {
          icon: Brain,
          color: "text-warning",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20"
        }
      case "proficient":
        return {
          icon: TrendingUp,
          color: "text-info",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20"
        }
      case "mastered":
        return {
          icon: CheckCircle2,
          color: "text-success",
          bg: "bg-green-500/10",
          border: "border-green-500/20"
        }
    }
  }

  const difficultyConfig = getDifficultyConfig(difficulty)
  const statusConfig = getStatusConfig(insights.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Brain className="w-6 h-6 text-icon-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">{conceptName}</h3>
              <p className="text-sm text-text-secondary">Sistema de Aprendizaje Adaptativo</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-text-primary">{(knowledge.pLn * 100).toFixed(0)}%</p>
            <p className="text-xs text-text-secondary">Probabilidad de dominio</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Progreso hacia dominio completo</span>
            <span className={cn("font-semibold", statusConfig.color)}>
              {insights.status === "mastered" ? "Dominado" : insights.status === "proficient" ? "Competente" : insights.status === "learning" ? "Aprendiendo" : "En desarrollo"}
            </span>
          </div>
          <Progress value={knowledge.pLn * 100} className="h-3" />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Intentos</span>
            <Target className="w-4 h-4 text-text-tertiary" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{knowledge.attempts}</p>
          <p className="text-xs text-text-tertiary">Total de preguntas</p>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Precisión</span>
            <Zap className="w-4 h-4 text-text-tertiary" />
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {knowledge.attempts > 0 ? ((knowledge.correctAnswers / knowledge.attempts) * 100).toFixed(0) : 0}%
          </p>
          <p className="text-xs text-text-tertiary">{knowledge.correctAnswers} correctas</p>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Siguiente</span>
            <Calendar className="w-4 h-4 text-text-tertiary" />
          </div>
          <p className="text-lg font-bold text-text-primary">
            {Math.ceil((nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
          </p>
          <p className="text-xs text-text-tertiary">Próxima revisión</p>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Predicción</span>
            <TrendingUp className="w-4 h-4 text-text-tertiary" />
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {(predictedSuccess * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-text-tertiary">Próximo acierto</p>
        </Card>
      </div>

      {/* Learning Progress Chart */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">Evolución del Conocimiento</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="attempt"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              label={{ value: 'Intentos', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
            />
            <YAxis
              domain={[0, 1]}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              label={{ value: 'P(Conocimiento)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'P(L)']}
            />
            <ReferenceLine
              y={0.95}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{ value: 'Dominio', fill: '#10b981', fontSize: 12 }}
            />
            <ReferenceLine
              y={0.7}
              stroke="#3b82f6"
              strokeDasharray="3 3"
              label={{ value: 'Competente', fill: '#3b82f6', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="pLn"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ fill: '#a855f7', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Current Status */}
      <Card className={cn("border backdrop-blur-sm p-6", statusConfig.border, statusConfig.bg)}>
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", statusConfig.bg, "border", statusConfig.border)}>
            <StatusIcon className={cn("w-6 h-6", statusConfig.color)} />
          </div>
          <div className="flex-1">
            <h4 className={cn("text-lg font-semibold mb-2", statusConfig.color)}>
              Estado: {insights.status === "mastered" ? "Dominado" : insights.status === "proficient" ? "Competente" : insights.status === "learning" ? "En Aprendizaje" : "En Desarrollo"}
            </h4>
            <p className="text-sm text-text-primary mb-3">{insights.recommendation}</p>
            <div className="flex items-center gap-4 text-sm text-text-body">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={difficultyConfig.color}>
                  Nivel: {difficultyConfig.label}
                </Badge>
              </div>
              {!isMastered && insights.estimatedAttemptsToMastery > 0 && (
                <span>
                  ~{insights.estimatedAttemptsToMastery} intentos más para dominar
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Practice Simulator */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">Simulador de Práctica</h4>
        <p className="text-sm text-text-secondary mb-4">
          Simula respuestas para ver cómo evoluciona tu probabilidad de conocimiento con el algoritmo BKT
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => handleAnswer(true)}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Respuesta Correcta
          </Button>
          <Button
            onClick={() => handleAnswer(false)}
            variant="outline"
            className="flex-1 border-red-500/50 hover:bg-red-500/10 text-error"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Respuesta Incorrecta
          </Button>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <p className="text-xs text-blue-300">
            💡 El sistema BKT ajusta la probabilidad de conocimiento basándose en tus respuestas,
            considerando también la posibilidad de errores por descuido (slip) y aciertos por suerte (guess).
          </p>
        </div>
      </Card>
    </div>
  )
}

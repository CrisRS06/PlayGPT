"use client"

import { motion } from "framer-motion"
import { Brain, TrendingUp, Target, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts"
import { cn } from "@/lib/utils"
import { useLearningProgressStore } from "@/stores/learning-progress-store"

interface TopicMastery {
  topic: string
  mastery: number
  attempts: number
  lastPracticed: string
}

interface KnowledgeProgressChartProps {
  variant?: "radar" | "bar" | "compact"
  topics?: TopicMastery[]
  showLegend?: boolean
  className?: string
}

export function KnowledgeProgressChart({
  variant = "radar",
  topics,
  showLegend = true,
  className
}: KnowledgeProgressChartProps) {
  const { modules } = useLearningProgressStore()

  // If no topics provided, generate from modules data
  const topicData: TopicMastery[] = topics || Object.values(modules).map(module => ({
    topic: module.title,
    mastery: module.progress,
    attempts: module.completedLessons,
    lastPracticed: new Date().toLocaleDateString()
  }))

  // Generate radar chart data
  const radarData = topicData.slice(0, 6).map(item => ({
    topic: item.topic.length > 15 ? item.topic.substring(0, 15) + "..." : item.topic,
    fullTopic: item.topic,
    mastery: Math.round(item.mastery),
    target: 80 // Target mastery level
  }))

  // Generate bar chart data
  const barData = topicData.map(item => ({
    name: item.topic.length > 20 ? item.topic.substring(0, 20) + "..." : item.topic,
    fullName: item.topic,
    mastery: Math.round(item.mastery),
    attempts: item.attempts
  }))

  const getMasteryColor = (mastery: number): string => {
    if (mastery >= 80) return "#10b981" // green
    if (mastery >= 60) return "#3b82f6" // blue
    if (mastery >= 40) return "#f59e0b" // yellow
    return "#ef4444" // red
  }

  const getMasteryLevel = (mastery: number): { label: string; color: string } => {
    if (mastery >= 80) return { label: "Experto", color: "text-success" }
    if (mastery >= 60) return { label: "Avanzado", color: "text-info" }
    if (mastery >= 40) return { label: "Intermedio", color: "text-warning" }
    return { label: "Principiante", color: "text-error" }
  }

  const averageMastery = topicData.reduce((sum, item) => sum + item.mastery, 0) / topicData.length || 0

  if (variant === "compact") {
    return (
      <Card className={cn("border-white/10 bg-white/5 backdrop-blur-sm p-4", className)}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-icon-primary" />
              <h4 className="text-sm font-semibold text-text-primary">Dominio de Temas</h4>
            </div>
            <Badge variant="outline" className="bg-purple-500/10 text-icon-primary border-purple-500/20">
              {averageMastery.toFixed(0)}% Promedio
            </Badge>
          </div>

          <div className="space-y-3">
            {topicData.slice(0, 5).map((topic, index) => {
              const level = getMasteryLevel(topic.mastery)
              return (
                <motion.div
                  key={topic.topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-primary truncate flex-1 mr-2">
                      {topic.topic}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs", level.color)}>
                        {level.label}
                      </Badge>
                      <span className="text-xs font-semibold text-text-primary min-w-[3rem] text-right">
                        {Math.round(topic.mastery)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={topic.mastery} className="h-2" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </Card>
    )
  }

  if (variant === "bar") {
    return (
      <Card className={cn("border-white/10 bg-white/5 backdrop-blur-sm p-6", className)}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-info" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Progreso por Tema</h3>
                <p className="text-xs text-text-secondary">Nivel de dominio en cada área</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-text-primary">{averageMastery.toFixed(0)}%</p>
              <p className="text-xs text-text-secondary">Promedio</p>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                width={150}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}% (${props.payload.attempts} intentos)`,
                  props.payload.fullName
                ]}
              />
              {showLegend && (
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
                />
              )}
              <Bar dataKey="mastery" name="Dominio" radius={[0, 8, 8, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getMasteryColor(entry.mastery)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-text-secondary mb-1">Expertos</p>
              <p className="text-lg font-bold text-success">
                {barData.filter(d => d.mastery >= 80).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-secondary mb-1">En Progreso</p>
              <p className="text-lg font-bold text-info">
                {barData.filter(d => d.mastery >= 40 && d.mastery < 80).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-secondary mb-1">Por Mejorar</p>
              <p className="text-lg font-bold text-error">
                {barData.filter(d => d.mastery < 40).length}
              </p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Default: Radar variant
  return (
    <Card className={cn("border-white/10 bg-white/5 backdrop-blur-sm p-6", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Mapa de Conocimiento</h3>
              <p className="text-xs text-text-secondary">Visualización del dominio por área</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-purple-500/10 text-icon-primary border-purple-500/20">
            <Zap className="w-3 h-3 mr-1" />
            {averageMastery.toFixed(0)}%
          </Badge>
        </div>

        {/* Radar Chart */}
        {radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis
                dataKey="topic"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#9ca3af' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                stroke="#9ca3af"
                style={{ fontSize: '10px' }}
                tick={{ fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value}%`,
                  props.payload.fullTopic
                ]}
              />
              <Radar
                name="Objetivo"
                dataKey="target"
                stroke="#6b7280"
                fill="#6b7280"
                fillOpacity={0.1}
              />
              <Radar
                name="Dominio Actual"
                dataKey="mastery"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.6}
              />
              {showLegend && (
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <div className="text-center text-text-tertiary">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Completa algunas lecciones para ver tu progreso</p>
            </div>
          </div>
        )}

        {/* Performance Indicators */}
        {radarData.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-xs text-text-secondary">Mejor Tema</span>
              </div>
              {(() => {
                const best = radarData.reduce((max, item) =>
                  item.mastery > max.mastery ? item : max
                , radarData[0])
                return (
                  <>
                    <p className="text-sm font-medium text-text-primary truncate">{best.fullTopic}</p>
                    <p className="text-lg font-bold text-success">{best.mastery}%</p>
                  </>
                )
              })()}
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-warning" />
                <span className="text-xs text-text-secondary">Por Mejorar</span>
              </div>
              {(() => {
                const worst = radarData.reduce((min, item) =>
                  item.mastery < min.mastery ? item : min
                , radarData[0])
                return (
                  <>
                    <p className="text-sm font-medium text-text-primary truncate">{worst.fullTopic}</p>
                    <p className="text-lg font-bold text-warning">{worst.mastery}%</p>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

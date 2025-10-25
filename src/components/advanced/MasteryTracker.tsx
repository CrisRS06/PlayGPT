"use client"

import { motion } from "framer-motion"
import { Star, Trophy, Zap, Target, Award, Crown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useLearningProgressStore } from "@/stores/learning-progress-store"

type MasteryLevel = "novice" | "apprentice" | "proficient" | "expert" | "master"

interface MasteryBadge {
  level: MasteryLevel
  title: string
  description: string
  icon: typeof Star
  color: string
  bgColor: string
  borderColor: string
  minProficiency: number
}

const MASTERY_LEVELS: MasteryBadge[] = [
  {
    level: "novice",
    title: "Novato",
    description: "Comenzando el viaje de aprendizaje",
    icon: Target,
    color: "text-text-secondary",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    minProficiency: 0
  },
  {
    level: "apprentice",
    title: "Aprendiz",
    description: "Comprendiendo los fundamentos",
    icon: Zap,
    color: "text-info",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    minProficiency: 0.3
  },
  {
    level: "proficient",
    title: "Competente",
    description: "Aplicando conocimientos con confianza",
    icon: Award,
    color: "text-success",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    minProficiency: 0.6
  },
  {
    level: "expert",
    title: "Experto",
    description: "Dominio avanzado del tema",
    icon: Trophy,
    color: "text-icon-primary",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    minProficiency: 0.85
  },
  {
    level: "master",
    title: "Maestro",
    description: "Maestría completa alcanzada",
    icon: Crown,
    color: "text-warning",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    minProficiency: 0.95
  }
]

function getMasteryLevel(proficiency: number): MasteryBadge {
  for (let i = MASTERY_LEVELS.length - 1; i >= 0; i--) {
    if (proficiency >= MASTERY_LEVELS[i].minProficiency) {
      return MASTERY_LEVELS[i]
    }
  }
  return MASTERY_LEVELS[0]
}

export function MasteryTracker() {
  const { modules } = useLearningProgressStore()

  const modulesList = Object.values(modules)

  // Calculate overall mastery based on module progress
  const totalProficiency = modulesList.length > 0
    ? modulesList.reduce((sum, module) => sum + (module.progress / 100), 0) / modulesList.length
    : 0

  const currentMastery = getMasteryLevel(totalProficiency)
  const nextMastery = MASTERY_LEVELS.find(level => level.minProficiency > totalProficiency)

  // Calculate mastery distribution
  const masteryDistribution = MASTERY_LEVELS.map(level => {
    const count = modulesList.filter(m => {
      const mLevel = getMasteryLevel(m.progress / 100)
      return mLevel.level === level.level
    }).length
    return { ...level, count }
  })

  // Get top modules
  const topModules = [...modulesList]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Overall Mastery Card */}
      <Card className={cn("border backdrop-blur-sm p-6", currentMastery.borderColor, currentMastery.bgColor)}>
        <div className="flex items-start gap-4 mb-4">
          <div className={cn(
            "w-16 h-16 rounded-xl flex items-center justify-center border-2",
            currentMastery.bgColor,
            currentMastery.borderColor
          )}>
            <currentMastery.icon className={cn("w-8 h-8", currentMastery.color)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-text-primary">{currentMastery.title}</h3>
              <Badge variant="outline" className={cn("text-xs", currentMastery.color)}>
                Nivel {MASTERY_LEVELS.findIndex(l => l.level === currentMastery.level) + 1}/5
              </Badge>
            </div>
            <p className="text-sm text-text-secondary mb-3">{currentMastery.description}</p>
            {nextMastery && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Progreso hacia {nextMastery.title}
                  </span>
                  <span className="text-text-primary font-semibold">
                    {((totalProficiency - currentMastery.minProficiency) / (nextMastery.minProficiency - currentMastery.minProficiency) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={(totalProficiency - currentMastery.minProficiency) / (nextMastery.minProficiency - currentMastery.minProficiency) * 100}
                  className="h-2"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Mastery Distribution */}
      <Card className="border-gray-200 bg-white backdrop-blur-sm p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">Distribución de Dominio</h4>
        <div className="space-y-3">
          {masteryDistribution.map((level, index) => {
            const Icon = level.icon
            const percentage = modulesList.length > 0 ? (level.count / modulesList.length) * 100 : 0

            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", level.color)} />
                    <span className="text-sm font-medium text-text-primary">{level.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-secondary">{level.count} módulos</span>
                    <span className="text-sm font-semibold text-text-primary min-w-[3rem] text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Top Modules */}
      {topModules.length > 0 && (
        <Card className="border-gray-200 bg-white backdrop-blur-sm p-6">
          <h4 className="text-lg font-semibold text-text-primary mb-4">Módulos con Mayor Progreso</h4>
          <div className="space-y-3">
            {topModules.map((module, index) => {
              const mastery = getMasteryLevel(module.progress / 100)
              const Icon = mastery.icon

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    mastery.borderColor,
                    mastery.bgColor
                  )}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200/30 text-lg font-bold text-text-primary">
                    {index + 1}
                  </div>
                  <div className="text-2xl">{module.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{module.title}</p>
                    <p className="text-xs text-text-secondary">
                      {module.completedLessons}/{module.totalLessons} lecciones completadas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-lg font-bold", mastery.color)}>
                      {module.progress.toFixed(0)}%
                    </p>
                    <p className="text-xs text-text-tertiary">{mastery.title}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Mastery Milestones */}
      <Card className="border-gray-200 bg-white backdrop-blur-sm p-6">
        <h4 className="text-lg font-semibold text-text-primary mb-4">Hitos de Maestría</h4>
        <div className="space-y-4">
          {MASTERY_LEVELS.map((level, index) => {
            const Icon = level.icon
            const isAchieved = totalProficiency >= level.minProficiency
            const isCurrent = currentMastery.level === level.level

            return (
              <div key={level.level} className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  isAchieved
                    ? `${level.borderColor} ${level.bgColor}`
                    : "border-gray-700 bg-gray-800/30"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isAchieved ? level.color : "text-text-tertiary"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className={cn(
                      "text-sm font-semibold",
                      isAchieved ? "text-text-primary" : "text-text-tertiary"
                    )}>
                      {level.title}
                    </h5>
                    {isCurrent && (
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-info border-blue-500/20">
                        Actual
                      </Badge>
                    )}
                    {isAchieved && !isCurrent && (
                      <Star className="w-4 h-4 text-warning fill-yellow-400" />
                    )}
                  </div>
                  <p className={cn(
                    "text-xs",
                    isAchieved ? "text-text-secondary" : "text-text-tertiary"
                  )}>
                    {level.description}
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    Requiere {(level.minProficiency * 100).toFixed(0)}% de dominio
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

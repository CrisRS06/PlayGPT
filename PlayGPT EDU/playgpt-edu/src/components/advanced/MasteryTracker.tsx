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
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    minProficiency: 0
  },
  {
    level: "apprentice",
    title: "Aprendiz",
    description: "Comprendiendo los fundamentos",
    icon: Zap,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    minProficiency: 0.3
  },
  {
    level: "proficient",
    title: "Competente",
    description: "Aplicando conocimientos con confianza",
    icon: Award,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    minProficiency: 0.6
  },
  {
    level: "expert",
    title: "Experto",
    description: "Dominio avanzado del tema",
    icon: Trophy,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    minProficiency: 0.85
  },
  {
    level: "master",
    title: "Maestro",
    description: "Maestría completa alcanzada",
    icon: Crown,
    color: "text-yellow-400",
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
  const { concepts, modules } = useLearningProgressStore()

  const conceptsList = Object.values(concepts)
  const modulesList = Object.values(modules)

  // Calculate overall mastery
  const totalProficiency = conceptsList.length > 0
    ? conceptsList.reduce((sum, concept) => sum + concept.masteryLevel, 0) / conceptsList.length
    : 0

  const currentMastery = getMasteryLevel(totalProficiency)
  const nextMastery = MASTERY_LEVELS.find(level => level.minProficiency > totalProficiency)

  // Calculate mastery distribution
  const masteryDistribution = MASTERY_LEVELS.map(level => {
    const count = conceptsList.filter(c => {
      const cLevel = getMasteryLevel(c.masteryLevel)
      return cLevel.level === level.level
    }).length
    return { ...level, count }
  })

  // Get top concepts
  const topConcepts = [...conceptsList]
    .sort((a, b) => b.masteryLevel - a.masteryLevel)
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
              <h3 className="text-2xl font-bold text-white">{currentMastery.title}</h3>
              <Badge variant="outline" className={cn("text-xs", currentMastery.color)}>
                Nivel {MASTERY_LEVELS.findIndex(l => l.level === currentMastery.level) + 1}/5
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mb-3">{currentMastery.description}</p>
            {nextMastery && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Progreso hacia {nextMastery.title}
                  </span>
                  <span className="text-white font-semibold">
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
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Distribución de Dominio</h4>
        <div className="space-y-3">
          {masteryDistribution.map((level, index) => {
            const Icon = level.icon
            const percentage = conceptsList.length > 0 ? (level.count / conceptsList.length) * 100 : 0

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
                    <span className="text-sm font-medium text-white">{level.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">{level.count} conceptos</span>
                    <span className="text-sm font-semibold text-white min-w-[3rem] text-right">
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

      {/* Top Concepts */}
      {topConcepts.length > 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Conceptos con Mayor Dominio</h4>
          <div className="space-y-3">
            {topConcepts.map((concept, index) => {
              const mastery = getMasteryLevel(concept.masteryLevel)
              const Icon = mastery.icon

              return (
                <motion.div
                  key={concept.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    mastery.borderColor,
                    mastery.bgColor
                  )}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/30 text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <Icon className={cn("w-5 h-5", mastery.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{concept.name}</p>
                    <p className="text-xs text-gray-400">
                      {concept.attempts} intentos • {concept.lastPracticed ? new Date(concept.lastPracticed).toLocaleDateString() : 'No practicado'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-lg font-bold", mastery.color)}>
                      {(concept.masteryLevel * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">{mastery.title}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Mastery Milestones */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Hitos de Maestría</h4>
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
                    isAchieved ? level.color : "text-gray-600"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className={cn(
                      "text-sm font-semibold",
                      isAchieved ? "text-white" : "text-gray-500"
                    )}>
                      {level.title}
                    </h5>
                    {isCurrent && (
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                        Actual
                      </Badge>
                    )}
                    {isAchieved && !isCurrent && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  <p className={cn(
                    "text-xs",
                    isAchieved ? "text-gray-400" : "text-gray-600"
                  )}>
                    {level.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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

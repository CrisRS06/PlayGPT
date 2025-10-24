"use client"

import { motion } from "framer-motion"
import { Target, Flame, Trophy, Zap, BookOpen, CheckCircle2, TrendingUp } from "lucide-react"
import { useLearningProgressStore } from "@/stores/learning-progress-store"
import { useGamificationStore } from "@/stores/gamification-store"
import { StatCard } from "./StatCard"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getLevelTitle } from "@/lib/gamification/xp-calculator"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

export function ProgressDashboard() {
  const { modules } = useLearningProgressStore()
  const { totalXP, level, currentStreak, longestStreak, unlockedAchievements } = useGamificationStore()

  const modulesList = Object.values(modules).sort((a, b) => a.order - b.order)
  const completedModules = modulesList.filter(m => m.status === 'completed').length
  const totalModules = modulesList.length
  const overallProgress = (completedModules / totalModules) * 100

  const levelInfo = getLevelTitle(level)

  // Mock data for XP progression chart
  const xpProgressionData = [
    { day: 'Lun', xp: Math.max(0, totalXP - 60) },
    { day: 'Mar', xp: Math.max(0, totalXP - 50) },
    { day: 'Mié', xp: Math.max(0, totalXP - 35) },
    { day: 'Jue', xp: Math.max(0, totalXP - 20) },
    { day: 'Vie', xp: Math.max(0, totalXP - 10) },
    { day: 'Sáb', xp: Math.max(0, totalXP - 5) },
    { day: 'Dom', xp: totalXP }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mi Progreso</h1>
        <p className="text-gray-400">Resumen de tu aprendizaje y logros alcanzados</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Nivel Actual"
          value={level}
          icon={Trophy}
          description={`${levelInfo.title} ${levelInfo.badge}`}
          color="primary"
        />
        <StatCard
          title="Total XP"
          value={totalXP}
          icon={Zap}
          description={`${Math.floor((totalXP % 100) / 100 * 100)}% al siguiente nivel`}
          color="warning"
        />
        <StatCard
          title="Racha Actual"
          value={`${currentStreak}d`}
          icon={Flame}
          description={`Récord: ${longestStreak} días`}
          color="danger"
        />
        <StatCard
          title="Logros"
          value={unlockedAchievements.length}
          icon={Target}
          description="Desafíos completados"
          color="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Progression Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Progresión de XP
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={xpProgressionData}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Module Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Progreso de Módulos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progreso general</span>
              <span className="text-sm font-semibold text-white">
                {completedModules}/{totalModules} completados
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />

            <div className="space-y-3 mt-6">
              {modulesList.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 text-xl">{module.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white truncate">
                        {module.title}
                      </span>
                      {module.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <span className="text-xs text-gray-500">
                          {Math.round(module.progress)}%
                        </span>
                      )}
                    </div>
                    <Progress
                      value={module.progress}
                      className="h-1.5"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Logros Recientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {unlockedAchievements.length > 0 ? (
            unlockedAchievements.slice(-3).map((achievementId, index) => (
              <motion.div
                key={achievementId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    Logro Desbloqueado
                  </p>
                  <p className="text-xs text-gray-400 truncate">{achievementId}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>¡Desbloquea tu primer logro completando actividades!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Next Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Próximos Objetivos</h3>
        <div className="space-y-3">
          {level < 5 && (
            <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
              <Trophy className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Alcanza Nivel {level + 1}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Faltan {(level * 100) - totalXP} XP para subir de nivel
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {Math.floor(((totalXP % 100) / 100) * 100)}%
              </Badge>
            </div>
          )}

          {currentStreak < 7 && (
            <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
              <Flame className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Racha de 7 Días</p>
                <p className="text-xs text-gray-400 mt-1">
                  Continúa tu racha {7 - currentStreak} días más para obtener +50 XP
                </p>
              </div>
              <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                {currentStreak}/7
              </Badge>
            </div>
          )}

          {completedModules < totalModules && (
            <div className="flex items-start gap-3 p-3 rounded-lg border border-green-500/20 bg-green-500/5">
              <BookOpen className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Completa Todos los Módulos</p>
                <p className="text-xs text-gray-400 mt-1">
                  Te faltan {totalModules - completedModules} módulos para completar el curso
                </p>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                {completedModules}/{totalModules}
              </Badge>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

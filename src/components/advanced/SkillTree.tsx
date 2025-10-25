"use client"

import { useCallback, useMemo } from "react"
import { ReactFlow, Node, Edge, Background, Controls, MiniMap, ConnectionLineType, Panel } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { motion } from "framer-motion"
import { Lock, CheckCircle2, Play, Star, Trophy, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useLearningProgressStore } from "@/stores/learning-progress-store"

type SkillStatus = "locked" | "available" | "in-progress" | "completed" | "mastered"

interface SkillNodeData extends Record<string, unknown> {
  label: string
  description: string
  status: SkillStatus
  progress: number
  xpReward: number
  icon: string
}

// Custom Node Component
function SkillNode({ data }: { data: SkillNodeData }) {
  const getStatusConfig = (status: SkillStatus) => {
    switch (status) {
      case "locked":
        return {
          bg: "bg-gray-800/50",
          border: "border-gray-600/30",
          icon: Lock,
          iconColor: "text-text-tertiary",
          textColor: "text-text-tertiary"
        }
      case "available":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/50",
          icon: Play,
          iconColor: "text-info",
          textColor: "text-blue-200"
        }
      case "in-progress":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/50",
          icon: Zap,
          iconColor: "text-warning",
          textColor: "text-yellow-200"
        }
      case "completed":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/50",
          icon: CheckCircle2,
          iconColor: "text-success",
          textColor: "text-green-200"
        }
      case "mastered":
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/50",
          icon: Star,
          iconColor: "text-icon-primary",
          textColor: "text-purple-200"
        }
    }
  }

  const config = getStatusConfig(data.status)
  const Icon = config.icon

  return (
    <motion.div
      whileHover={{ scale: data.status !== "locked" ? 1.05 : 1 }}
      className={cn(
        "px-4 py-3 rounded-lg border-2 backdrop-blur-sm min-w-[180px] cursor-pointer",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", config.iconColor)} />
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-semibold leading-tight", config.textColor)}>
            {data.label}
          </p>
          {data.status !== "locked" && (
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {data.status === "in-progress" && (
        <div className="mt-2">
          <Progress value={data.progress} className="h-1.5" />
          <p className="text-xs text-text-tertiary mt-1">{data.progress}% completado</p>
        </div>
      )}

      {(data.status === "available" || data.status === "in-progress") && (
        <div className="flex items-center gap-1 mt-2">
          <Trophy className="w-3 h-3 text-warning" />
          <span className="text-xs text-warning">+{data.xpReward} XP</span>
        </div>
      )}
    </motion.div>
  )
}

const nodeTypes = {
  skillNode: SkillNode
}

export function SkillTree() {
  const { modules } = useLearningProgressStore()

  // Define skill tree structure
  const initialNodes: Node<SkillNodeData>[] = useMemo(() => {
    // Safe access to modules with defaults
    const safeModules = modules || {}
    // Temporary: concepts system not yet implemented, use empty defaults
    const safeConcepts = {} as Record<string, { masteryLevel: number }>

    return [
    // Foundation Level (Row 1)
    {
      id: "basics",
      type: "skillNode",
      position: { x: 400, y: 50 },
      data: {
        label: "Fundamentos",
        description: "Introducción al juego responsable",
        status: safeModules["module-1"]?.status === "completed" ? "completed" :
                safeModules["module-1"]?.status === "in-progress" ? "in-progress" : "available",
        progress: safeModules["module-1"]?.progress || 0,
        xpReward: 50,
        icon: "🎯"
      }
    },

    // Core Concepts (Row 2)
    {
      id: "probability",
      type: "skillNode",
      position: { x: 200, y: 180 },
      data: {
        label: "Probabilidades",
        description: "Entender las probabilidades básicas",
        status: safeConcepts["probability"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["probability"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["probability"]?.masteryLevel > 0 ? "in-progress" :
                safeModules["module-1"]?.status === "completed" ? "available" : "locked",
        progress: (safeConcepts["probability"]?.masteryLevel || 0) * 100,
        xpReward: 100,
        icon: "🎲"
      }
    },
    {
      id: "expected-value",
      type: "skillNode",
      position: { x: 600, y: 180 },
      data: {
        label: "Valor Esperado",
        description: "Calcular el EV de apuestas",
        status: safeConcepts["expected-value"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["expected-value"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["expected-value"]?.masteryLevel > 0 ? "in-progress" :
                safeModules["module-1"]?.status === "completed" ? "available" : "locked",
        progress: (safeConcepts["expected-value"]?.masteryLevel || 0) * 100,
        xpReward: 120,
        icon: "💰"
      }
    },

    // Advanced Concepts (Row 3)
    {
      id: "house-edge",
      type: "skillNode",
      position: { x: 100, y: 310 },
      data: {
        label: "Ventaja Casa",
        description: "Comprender la ventaja de la casa",
        status: safeConcepts["house-edge"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["house-edge"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["house-edge"]?.masteryLevel > 0 ? "in-progress" :
                safeConcepts["probability"]?.masteryLevel >= 0.6 ? "available" : "locked",
        progress: (safeConcepts["house-edge"]?.masteryLevel || 0) * 100,
        xpReward: 150,
        icon: "🏛️"
      }
    },
    {
      id: "variance",
      type: "skillNode",
      position: { x: 350, y: 310 },
      data: {
        label: "Varianza",
        description: "Entender la variabilidad",
        status: safeConcepts["variance"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["variance"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["variance"]?.masteryLevel > 0 ? "in-progress" :
                safeConcepts["probability"]?.masteryLevel >= 0.6 ? "available" : "locked",
        progress: (safeConcepts["variance"]?.masteryLevel || 0) * 100,
        xpReward: 150,
        icon: "📊"
      }
    },
    {
      id: "bankroll",
      type: "skillNode",
      position: { x: 600, y: 310 },
      data: {
        label: "Gestión Bankroll",
        description: "Administrar tu presupuesto",
        status: safeConcepts["bankroll"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["bankroll"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["bankroll"]?.masteryLevel > 0 ? "in-progress" :
                safeConcepts["expected-value"]?.masteryLevel >= 0.6 ? "available" : "locked",
        progress: (safeConcepts["bankroll"]?.masteryLevel || 0) * 100,
        xpReward: 180,
        icon: "💼"
      }
    },
    {
      id: "kelly",
      type: "skillNode",
      position: { x: 850, y: 310 },
      data: {
        label: "Criterio Kelly",
        description: "Optimización de apuestas",
        status: safeConcepts["kelly"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["kelly"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["kelly"]?.masteryLevel > 0 ? "in-progress" :
                safeConcepts["expected-value"]?.masteryLevel >= 0.6 ? "available" : "locked",
        progress: (safeConcepts["kelly"]?.masteryLevel || 0) * 100,
        xpReward: 200,
        icon: "📐"
      }
    },

    // Expert Level (Row 4)
    {
      id: "psychology",
      type: "skillNode",
      position: { x: 200, y: 440 },
      data: {
        label: "Psicología",
        description: "Sesgos cognitivos y control",
        status: safeConcepts["psychology"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["psychology"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["psychology"]?.masteryLevel > 0 ? "in-progress" :
                safeConcepts["variance"]?.masteryLevel >= 0.6 ? "available" : "locked",
        progress: (safeConcepts["psychology"]?.masteryLevel || 0) * 100,
        xpReward: 250,
        icon: "🧠"
      }
    },
    {
      id: "sports-betting",
      type: "skillNode",
      position: { x: 500, y: 440 },
      data: {
        label: "Apuestas Deportivas",
        description: "Análisis deportivo avanzado",
        status: safeConcepts["sports-betting"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["sports-betting"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["sports-betting"]?.masteryLevel > 0 ? "in-progress" :
                safeConcepts["bankroll"]?.masteryLevel >= 0.6 ? "available" : "locked",
        progress: (safeConcepts["sports-betting"]?.masteryLevel || 0) * 100,
        xpReward: 300,
        icon: "🏈"
      }
    },
    {
      id: "responsible-gaming",
      type: "skillNode",
      position: { x: 800, y: 440 },
      data: {
        label: "Juego Responsable",
        description: "Prevención y autocontrol",
        status: safeConcepts["responsible-gaming"]?.masteryLevel >= 0.8 ? "mastered" :
                safeConcepts["responsible-gaming"]?.masteryLevel >= 0.6 ? "completed" :
                safeConcepts["responsible-gaming"]?.masteryLevel > 0 ? "in-progress" :
                safeConcepts["psychology"]?.masteryLevel >= 0.6 ? "available" : "locked",
        progress: (safeConcepts["responsible-gaming"]?.masteryLevel || 0) * 100,
        xpReward: 300,
        icon: "🛡️"
      }
    }
  ]
  }, [modules])

  const initialEdges: Edge[] = useMemo(() => [
    // Foundation connections
    { id: "e1", source: "basics", target: "probability", type: "smoothstep", animated: true },
    { id: "e2", source: "basics", target: "expected-value", type: "smoothstep", animated: true },

    // Core to Advanced
    { id: "e3", source: "probability", target: "house-edge", type: "smoothstep" },
    { id: "e4", source: "probability", target: "variance", type: "smoothstep" },
    { id: "e5", source: "expected-value", target: "bankroll", type: "smoothstep" },
    { id: "e6", source: "expected-value", target: "kelly", type: "smoothstep" },

    // Advanced to Expert
    { id: "e7", source: "variance", target: "psychology", type: "smoothstep" },
    { id: "e8", source: "bankroll", target: "sports-betting", type: "smoothstep" },
    { id: "e9", source: "psychology", target: "responsible-gaming", type: "smoothstep" },
    { id: "e10", source: "kelly", target: "sports-betting", type: "smoothstep" }
  ], [])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<SkillNodeData>) => {
    // Here you could open a modal with more details, start a lesson, etc.
  }, [])

  // Calculate completion stats
  const stats = useMemo(() => {
    const total = initialNodes.length
    const completed = initialNodes.filter(n =>
      n.data.status === "completed" || n.data.status === "mastered"
    ).length
    const mastered = initialNodes.filter(n => n.data.status === "mastered").length
    const available = initialNodes.filter(n => n.data.status === "available").length

    return { total, completed, mastered, available }
  }, [initialNodes])

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-icon-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Árbol de Habilidades</h3>
              <p className="text-xs text-text-secondary">Progreso del curriculum educativo</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-text-primary">{stats.completed}/{stats.total}</p>
            <p className="text-xs text-text-secondary">Completadas</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-2 text-center">
            <p className="text-xs text-text-secondary">Dominadas</p>
            <p className="text-lg font-bold text-icon-primary">{stats.mastered}</p>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-2 text-center">
            <p className="text-xs text-text-secondary">Completadas</p>
            <p className="text-lg font-bold text-success">{stats.completed}</p>
          </div>
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2 text-center">
            <p className="text-xs text-text-secondary">Disponibles</p>
            <p className="text-lg font-bold text-info">{stats.available}</p>
          </div>
          <div className="rounded-lg border border-gray-500/20 bg-gray-500/5 p-2 text-center">
            <p className="text-xs text-text-secondary">Bloqueadas</p>
            <p className="text-lg font-bold text-text-secondary">
              {stats.total - stats.completed - stats.available}
            </p>
          </div>
        </div>
      </div>

      {/* Skill Tree Canvas */}
      <div style={{ height: "600px" }} className="bg-black/30">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          defaultEdgeOptions={{
            style: { stroke: "#6366f1", strokeWidth: 2 },
            animated: false
          }}
        >
          <Background color="#374151" gap={16} />
          <Controls className="bg-gray-800 border-white/10" />
          <MiniMap
            className="bg-gray-900 border border-white/10"
            nodeColor={(node) => {
              const status = (node.data as SkillNodeData).status
              switch (status) {
                case "locked": return "#6b7280"
                case "available": return "#3b82f6"
                case "in-progress": return "#f59e0b"
                case "completed": return "#10b981"
                case "mastered": return "#a855f7"
                default: return "#6b7280"
              }
            }}
          />
          <Panel position="bottom-right" className="bg-gray-900/90 border border-white/10 rounded-lg p-3 m-2">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-text-tertiary" />
                <span className="text-text-secondary">Bloqueada</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-3 h-3 text-info" />
                <span className="text-text-secondary">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-warning" />
                <span className="text-text-secondary">En progreso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-success" />
                <span className="text-text-secondary">Completada</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-icon-primary" />
                <span className="text-text-secondary">Dominada</span>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </Card>
  )
}

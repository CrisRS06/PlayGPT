"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "primary" | "secondary" | "success" | "warning" | "danger"
  className?: string
}

const colorVariants = {
  primary: {
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: "text-blue-500"
  },
  secondary: {
    gradient: "from-purple-500 to-purple-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    icon: "text-purple-500"
  },
  success: {
    gradient: "from-green-500 to-green-600",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    icon: "text-green-500"
  },
  warning: {
    gradient: "from-yellow-500 to-yellow-600",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
    icon: "text-yellow-500"
  },
  danger: {
    gradient: "from-red-500 to-red-600",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    icon: "text-red-500"
  }
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "primary",
  className
}: StatCardProps) {
  const colors = colorVariants[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-xl border",
        colors.border,
        colors.bg,
        "backdrop-blur-sm p-6",
        "hover:shadow-lg transition-shadow",
        className
      )}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-5`} />

      {/* Content */}
      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-white">{value}</h3>
              {trend && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive ? "text-green-400" : "text-red-400"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
          </div>

          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              colors.bg,
              "border",
              colors.border
            )}
          >
            <Icon className={cn("w-6 h-6", colors.icon)} />
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        )}
      </div>
    </motion.div>
  )
}

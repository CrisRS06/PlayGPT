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
    gradient: "from-primary to-primary-hover",
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    icon: "text-icon-primary"
  },
  secondary: {
    gradient: "from-accent to-accent-hover",
    bg: "bg-accent/10",
    border: "border-accent/30",
    text: "text-accent",
    icon: "text-icon-accent"
  },
  success: {
    gradient: "from-success to-success",
    bg: "bg-success/10",
    border: "border-success/30",
    text: "text-success",
    icon: "text-success"
  },
  warning: {
    gradient: "from-warning to-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    text: "text-warning",
    icon: "text-warning"
  },
  danger: {
    gradient: "from-error to-error",
    bg: "bg-error/10",
    border: "border-error/30",
    text: "text-error",
    icon: "text-error"
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
            <p className="text-sm text-text-secondary font-medium">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
              {trend && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive ? "text-success" : "text-error"
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
          <p className="text-xs text-text-tertiary leading-relaxed">{description}</p>
        )}
      </div>
    </motion.div>
  )
}

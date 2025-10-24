"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProgressDashboard } from "@/components/dashboard/ProgressDashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 backdrop-blur-xl bg-black/50 px-6 py-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild aria-label="Volver al chat">
            <Link href="/chat">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            <p className="text-xs text-gray-400">Panel de Progreso</p>
          </div>
        </div>
      </motion.header>

      {/* Dashboard Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        <ProgressDashboard />
      </motion.main>
    </div>
  )
}

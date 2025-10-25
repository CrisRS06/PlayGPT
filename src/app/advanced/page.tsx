"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkillTree } from "@/components/advanced/SkillTree"
import { AdaptiveLearningDashboard } from "@/components/advanced/AdaptiveLearningDashboard"
import { NFLBettingSimulator } from "@/components/advanced/NFLBettingSimulator"
import { MasteryTracker } from "@/components/advanced/MasteryTracker"

export default function AdvancedPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-gray-200 backdrop-blur-xl bg-white/90 px-6 py-4 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild aria-label="Volver al chat">
                <Link href="/chat">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Características Avanzadas</h1>
                  <p className="text-xs text-gray-600">Sistema educativo adaptativo con IA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto p-6"
      >
        <Tabs defaultValue="skill-tree" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 border border-gray-200">
            <TabsTrigger value="skill-tree">Skill Tree</TabsTrigger>
            <TabsTrigger value="adaptive">Aprendizaje Adaptativo</TabsTrigger>
            <TabsTrigger value="nfl">NFL Simulator</TabsTrigger>
            <TabsTrigger value="mastery">Mastery System</TabsTrigger>
          </TabsList>

          <TabsContent value="skill-tree" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Árbol de Habilidades</h2>
              <p className="text-gray-600 mb-6">
                Visualiza tu progreso a través del curriculum educativo. Las habilidades se desbloquean
                conforme dominas los prerequisitos.
              </p>
            </div>
            <SkillTree />
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 mt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">
                    Sistema de Progresión
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    El árbol de habilidades visualiza tu camino de aprendizaje. Cada nodo representa un concepto
                    o habilidad que debes dominar. Las conexiones muestran las dependencias entre conceptos.
                    Completa los fundamentos para desbloquear temas avanzados.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="adaptive" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aprendizaje Adaptativo (BKT)</h2>
              <p className="text-gray-600 mb-6">
                Sistema de inteligencia artificial que ajusta la dificultad basándose en tu rendimiento
                usando Bayesian Knowledge Tracing.
              </p>
            </div>
            <AdaptiveLearningDashboard
              conceptId="expected-value"
              conceptName="Valor Esperado (EV)"
            />
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">
                    ¿Cómo funciona BKT?
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    Bayesian Knowledge Tracing (BKT) es un algoritmo de IA que modela tu conocimiento como
                    una probabilidad binaria (conocido/desconocido) y la actualiza después de cada respuesta.
                  </p>
                  <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                    <li><strong>P(L₀):</strong> Probabilidad inicial de conocimiento (10%)</li>
                    <li><strong>P(T):</strong> Probabilidad de aprendizaje por práctica (15%)</li>
                    <li><strong>P(S):</strong> Probabilidad de error por descuido (10%)</li>
                    <li><strong>P(G):</strong> Probabilidad de acierto por suerte (25%)</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nfl" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Simulador de Apuestas NFL</h2>
              <p className="text-gray-600 mb-6">
                Aprende sobre apuestas deportivas con un simulador realista que incluye Moneyline,
                Point Spread y Over/Under.
              </p>
            </div>
            <NFLBettingSimulator />
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-300 mb-2">
                    Tipos de Apuestas NFL
                  </h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Moneyline</p>
                      <p>Apuesta directa al ganador. Las cuotas reflejan la probabilidad de victoria.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Point Spread</p>
                      <p>El favorito debe ganar por más puntos que el hándicap. El underdog puede perder
                         por menos puntos y aún "cubrir el spread".</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Over/Under (Total)</p>
                      <p>Apuesta a si la suma total de puntos será mayor (Over) o menor (Under) que
                         la línea establecida.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mastery" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Maestría</h2>
              <p className="text-gray-600 mb-6">
                Rastrea tu progreso hacia la maestría completa con un sistema de niveles que refleja
                tu dominio real de cada concepto.
              </p>
            </div>
            <MasteryTracker />
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    Niveles de Maestría
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                    <div>
                      <p className="font-semibold text-gray-900">🎯 Novato (0-30%)</p>
                      <p className="text-xs">Comenzando el viaje de aprendizaje</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">⚡ Aprendiz (30-60%)</p>
                      <p className="text-xs">Comprendiendo los fundamentos</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">🏅 Competente (60-85%)</p>
                      <p className="text-xs">Aplicando conocimientos con confianza</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">🏆 Experto (85-95%)</p>
                      <p className="text-xs">Dominio avanzado del tema</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-semibold text-gray-900">👑 Maestro (95%+)</p>
                      <p className="text-xs">Maestría completa alcanzada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  )
}

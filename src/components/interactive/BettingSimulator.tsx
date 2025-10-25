"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, RefreshCw, TrendingDown, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { cn } from "@/lib/utils"

interface GameConfig {
  name: string
  winProbability: number
  payout: number
  houseEdge: number
  description: string
}

const GAMES: Record<string, GameConfig> = {
  roulette_red: {
    name: "Ruleta - Rojo/Negro",
    winProbability: 18/37, // European roulette
    payout: 2,
    houseEdge: 2.7,
    description: "Apuesta a rojo o negro en la ruleta europea"
  },
  coin_flip_fair: {
    name: "Moneda - Justa",
    winProbability: 0.5,
    payout: 2,
    houseEdge: 0,
    description: "Lanzamiento de moneda perfectamente justo"
  },
  coin_flip_house: {
    name: "Moneda - con Ventaja Casa",
    winProbability: 0.48,
    payout: 2,
    houseEdge: 4,
    description: "Lanzamiento de moneda con 4% de ventaja para la casa"
  },
  blackjack: {
    name: "Blackjack - Básico",
    winProbability: 0.49,
    payout: 2,
    houseEdge: 2,
    description: "Blackjack con estrategia básica"
  },
  slots: {
    name: "Tragamonedas",
    winProbability: 0.35,
    payout: 2.5,
    houseEdge: 12.5,
    description: "Máquina tragamonedas típica"
  }
}

interface SimulationResult {
  round: number
  bankroll: number
  netProfit: number
}

export function BettingSimulator() {
  const [initialBankroll, setInitialBankroll] = useState<string>("1000")
  const [betSize, setBetSize] = useState<string>("10")
  const [numRounds, setNumRounds] = useState<string>("100")
  const [selectedGame, setSelectedGame] = useState<string>("roulette_red")
  const [results, setResults] = useState<SimulationResult[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [finalStats, setFinalStats] = useState<{
    finalBankroll: number
    netProfit: number
    roi: number
    totalWagered: number
    wins: number
    losses: number
  } | null>(null)

  const game = GAMES[selectedGame]

  const runSimulation = () => {
    setIsSimulating(true)

    const startBankroll = parseFloat(initialBankroll) || 1000
    const bet = parseFloat(betSize) || 10
    const rounds = parseInt(numRounds) || 100

    let currentBankroll = startBankroll
    const simulationData: SimulationResult[] = []
    let wins = 0
    let losses = 0

    // Initial state
    simulationData.push({
      round: 0,
      bankroll: currentBankroll,
      netProfit: 0
    })

    // Run simulation
    for (let i = 1; i <= rounds; i++) {
      // Check if bankroll is sufficient
      if (currentBankroll < bet) {
        break
      }

      // Simulate bet outcome
      const random = Math.random()
      const isWin = random < game.winProbability

      if (isWin) {
        currentBankroll += bet * (game.payout - 1)
        wins++
      } else {
        currentBankroll -= bet
        losses++
      }

      simulationData.push({
        round: i,
        bankroll: currentBankroll,
        netProfit: currentBankroll - startBankroll
      })
    }

    const totalWagered = (wins + losses) * bet
    const finalBankroll = currentBankroll
    const netProfit = finalBankroll - startBankroll
    const roi = (netProfit / startBankroll) * 100

    setResults(simulationData)
    setFinalStats({
      finalBankroll,
      netProfit,
      roi,
      totalWagered,
      wins,
      losses
    })

    setIsSimulating(false)
  }

  const resetSimulation = () => {
    setResults([])
    setFinalStats(null)
  }

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  return (
    <Card className="border-gray-200 bg-white backdrop-blur-sm p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Play className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Simulador de Apuestas</h3>
            <p className="text-xs text-text-secondary">Visualiza el impacto a largo plazo de las apuestas</p>
          </div>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="game" className="text-sm text-text-body">
              Tipo de Juego
            </Label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger id="game" className="bg-white/90 border-gray-200 text-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-200">
                {Object.entries(GAMES).map(([key, game]) => (
                  <SelectItem key={key} value={key} className="text-text-primary hover:bg-white">
                    {game.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-text-tertiary">{game.description}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialBankroll" className="text-sm text-text-body">
              Bankroll Inicial ($)
            </Label>
            <Input
              id="initialBankroll"
              type="number"
              value={initialBankroll}
              onChange={(e) => setInitialBankroll(e.target.value)}
              className="bg-white/90 border-gray-200 text-text-primary"
              placeholder="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="betSize" className="text-sm text-text-body">
              Tamaño de Apuesta ($)
            </Label>
            <Input
              id="betSize"
              type="number"
              value={betSize}
              onChange={(e) => setBetSize(e.target.value)}
              className="bg-white/90 border-gray-200 text-text-primary"
              placeholder="10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numRounds" className="text-sm text-text-body">
              Número de Rondas
            </Label>
            <Input
              id="numRounds"
              type="number"
              value={numRounds}
              onChange={(e) => setNumRounds(e.target.value)}
              className="bg-white/90 border-gray-200 text-text-primary"
              placeholder="100"
            />
          </div>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-3">
            <p className="text-xs text-text-secondary mb-1">Prob. Ganar</p>
            <p className="text-lg font-bold text-text-primary">{(game.winProbability * 100).toFixed(1)}%</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-3">
            <p className="text-xs text-text-secondary mb-1">Pago</p>
            <p className="text-lg font-bold text-text-primary">{game.payout}x</p>
          </div>
          <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
            <p className="text-xs text-text-secondary mb-1">Ventaja Casa</p>
            <p className="text-lg font-bold text-streak-orange">{game.houseEdge.toFixed(1)}%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={runSimulation}
            disabled={isSimulating}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {isSimulating ? "Simulando..." : "Ejecutar Simulación"}
          </Button>
          {results.length > 0 && (
            <Button
              onClick={resetSimulation}
              variant="outline"
              className="border-gray-200 hover:bg-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && finalStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-4 border-t border-gray-200"
          >
            {/* Chart */}
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
              <h4 className="text-sm font-semibold text-text-primary mb-4">Evolución del Bankroll</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="round"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Ronda', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${value}`}
                    label={{ value: 'Bankroll', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Bankroll']}
                  />
                  <ReferenceLine
                    y={parseFloat(initialBankroll)}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                    label={{ value: 'Inicial', fill: '#6b7280', fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bankroll"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">Bankroll Final</span>
                  <DollarSign className="w-4 h-4 text-text-tertiary" />
                </div>
                <p
                  className={cn(
                    "text-xl font-bold",
                    finalStats.finalBankroll >= parseFloat(initialBankroll) ? "text-success" : "text-error"
                  )}
                >
                  {formatCurrency(finalStats.finalBankroll)}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">Ganancia Neta</span>
                  {finalStats.netProfit >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-error" />
                  )}
                </div>
                <p
                  className={cn(
                    "text-xl font-bold",
                    finalStats.netProfit >= 0 ? "text-success" : "text-error"
                  )}
                >
                  {finalStats.netProfit >= 0 ? "+" : ""}{formatCurrency(finalStats.netProfit)}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">ROI</span>
                </div>
                <p
                  className={cn(
                    "text-xl font-bold",
                    finalStats.roi >= 0 ? "text-success" : "text-error"
                  )}
                >
                  {finalStats.roi >= 0 ? "+" : ""}{finalStats.roi.toFixed(2)}%
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <span className="text-xs text-text-secondary">Total Apostado</span>
                <p className="text-lg font-bold text-text-primary mt-1">
                  {formatCurrency(finalStats.totalWagered)}
                </p>
              </div>

              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <span className="text-xs text-text-secondary">Victorias</span>
                <p className="text-lg font-bold text-success mt-1">
                  {finalStats.wins}
                </p>
              </div>

              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <span className="text-xs text-text-secondary">Derrotas</span>
                <p className="text-lg font-bold text-error mt-1">
                  {finalStats.losses}
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-3">
              {finalStats.netProfit < 0 && game.houseEdge > 0 && (
                <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-streak-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-300 mb-1">
                        La ventaja de la casa prevalece
                      </p>
                      <p className="text-xs text-text-secondary">
                        Aunque puedes ganar en el corto plazo, la ventaja matemática de {game.houseEdge.toFixed(1)}%
                        de la casa tiende a manifestarse a lo largo del tiempo. Este es el motivo por el cual los casinos
                        siempre ganan a largo plazo.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {finalStats.netProfit > 0 && (
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-300 mb-1">
                        ¡Tuviste suerte esta vez!
                      </p>
                      <p className="text-xs text-text-secondary">
                        Obtuviste ganancias en esta simulación, pero recuerda que esto es varianza a corto plazo.
                        {game.houseEdge > 0 && " La ventaja de la casa significa que, en promedio, perderías dinero si continuaras jugando indefinidamente."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {finalStats.wins / (finalStats.wins + finalStats.losses) < game.winProbability - 0.05 && (
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className="text-xs text-blue-300">
                    💡 Tu tasa de victorias ({((finalStats.wins / (finalStats.wins + finalStats.losses)) * 100).toFixed(1)}%)
                    fue menor que la probabilidad teórica ({(game.winProbability * 100).toFixed(1)}%).
                    Esto es normal con pocas rondas - la ley de los grandes números requiere muchas más repeticiones.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  )
}

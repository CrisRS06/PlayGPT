"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, TrendingDown, TrendingUp, Info, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface EVResult {
  expectedValue: number
  expectedValuePercentage: number
  houseEdge: number
  longTermResult: number
}

export function EVCalculator() {
  const [betAmount, setBetAmount] = useState<string>("100")
  const [odds, setOdds] = useState<string>("2.0")
  const [winProbability, setWinProbability] = useState<string>("48")
  const [numBets, setNumBets] = useState<string>("100")
  const [result, setResult] = useState<EVResult | null>(null)

  const calculateEV = () => {
    const bet = parseFloat(betAmount) || 0
    const oddsValue = parseFloat(odds) || 0
    const probability = parseFloat(winProbability) / 100 || 0
    const bets = parseFloat(numBets) || 0

    // Expected Value = (Probability of Winning × Amount Won) - (Probability of Losing × Amount Lost)
    const amountWon = bet * (oddsValue - 1) // Net profit when winning
    const amountLost = bet
    const lossProbability = 1 - probability

    const ev = (probability * amountWon) - (lossProbability * amountLost)
    const evPercentage = (ev / bet) * 100
    const houseEdge = -evPercentage

    // Long-term result over multiple bets
    const longTerm = ev * bets

    setResult({
      expectedValue: ev,
      expectedValuePercentage: evPercentage,
      houseEdge: houseEdge,
      longTermResult: longTerm
    })
  }

  const getInsight = (ev: number): { text: string; color: string; icon: typeof TrendingDown } => {
    if (ev > 0) {
      return {
        text: "Esta apuesta tiene valor positivo (+EV). A largo plazo, ganarías dinero.",
        color: "text-green-400",
        icon: TrendingUp
      }
    } else if (ev === 0) {
      return {
        text: "Esta apuesta es neutra. A largo plazo, no ganarías ni perderías.",
        color: "text-yellow-400",
        icon: Info
      }
    } else {
      return {
        text: "Esta apuesta tiene valor negativo (-EV). A largo plazo, perderías dinero.",
        color: "text-red-400",
        icon: TrendingDown
      }
    }
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Calculadora de Valor Esperado</h3>
            <p className="text-xs text-gray-400">Descubre el valor real de tus apuestas</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="betAmount" className="text-sm text-gray-300">
              Cantidad de la Apuesta ($)
            </Label>
            <Input
              id="betAmount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="odds" className="text-sm text-gray-300">
              Cuota / Odds (Decimal)
            </Label>
            <Input
              id="odds"
              type="number"
              step="0.1"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              placeholder="2.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="winProbability" className="text-sm text-gray-300">
              Probabilidad de Ganar (%)
            </Label>
            <Input
              id="winProbability"
              type="number"
              step="0.1"
              value={winProbability}
              onChange={(e) => setWinProbability(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              placeholder="48"
            />
            <Progress value={parseFloat(winProbability)} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numBets" className="text-sm text-gray-300">
              Número de Apuestas
            </Label>
            <Input
              id="numBets"
              type="number"
              value={numBets}
              onChange={(e) => setNumBets(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              placeholder="100"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={calculateEV}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calcular Valor Esperado
        </Button>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-4 border-t border-white/10"
          >
            {/* EV Per Bet */}
            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Valor Esperado (por apuesta)</span>
                <DollarSign className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "text-3xl font-bold",
                    result.expectedValue > 0 ? "text-green-400" : result.expectedValue < 0 ? "text-red-400" : "text-yellow-400"
                  )}
                >
                  ${result.expectedValue.toFixed(2)}
                </span>
                <span
                  className={cn(
                    "text-lg font-medium",
                    result.expectedValuePercentage > 0 ? "text-green-400" : result.expectedValuePercentage < 0 ? "text-red-400" : "text-yellow-400"
                  )}
                >
                  ({result.expectedValuePercentage > 0 ? "+" : ""}{result.expectedValuePercentage.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* House Edge */}
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Ventaja de la Casa</span>
                <TrendingDown className="w-4 h-4 text-orange-500" />
              </div>
              <span className="text-2xl font-bold text-orange-400">
                {result.houseEdge.toFixed(2)}%
              </span>
            </div>

            {/* Long-term Result */}
            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  Resultado después de {numBets} apuestas
                </span>
                <TrendingDown className="w-4 h-4 text-gray-500" />
              </div>
              <span
                className={cn(
                  "text-2xl font-bold",
                  result.longTermResult > 0 ? "text-green-400" : result.longTermResult < 0 ? "text-red-400" : "text-yellow-400"
                )}
              >
                ${result.longTermResult.toFixed(2)}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Total apostado: ${(parseFloat(betAmount) * parseFloat(numBets)).toFixed(2)}
              </p>
            </div>

            {/* Insight */}
            {(() => {
              const insight = getInsight(result.expectedValue)
              const Icon = insight.icon
              return (
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", insight.color)} />
                    <div>
                      <p className="text-sm font-medium text-white mb-1">Interpretación</p>
                      <p className={cn("text-sm", insight.color)}>
                        {insight.text}
                      </p>
                      {result.expectedValue < 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Recuerda: En la mayoría de los juegos de casino, la casa siempre tiene ventaja matemática. Juega de forma responsable y dentro de tus límites.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}

        {/* Educational Note */}
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-purple-300">¿Qué es el Valor Esperado?</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                El EV (Expected Value) es el promedio de ganancias o pérdidas que puedes esperar por cada apuesta a largo plazo.
                Un EV negativo significa que perderás dinero con el tiempo, mientras que un EV positivo indica una apuesta favorable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, TrendingUp, TrendingDown, DollarSign, Trophy, Target, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type BetType = "moneyline" | "spread" | "total"

interface NFLTeam {
  name: string
  city: string
  conference: "AFC" | "NFC"
  power: number // Team strength rating (0-100)
}

interface BetOption {
  type: BetType
  description: string
  odds: number // American odds (e.g., -110, +150)
  threshold?: number // For spread/totals
}

interface SimulationResult {
  betType: BetType
  teamBet: string
  amount: number
  won: boolean
  payout: number
  profit: number
}

// Sample NFL teams with power rankings
const NFL_TEAMS: NFLTeam[] = [
  { name: "Chiefs", city: "Kansas City", conference: "AFC", power: 95 },
  { name: "49ers", city: "San Francisco", conference: "NFC", power: 92 },
  { name: "Bills", city: "Buffalo", conference: "AFC", power: 90 },
  { name: "Eagles", city: "Philadelphia", conference: "NFC", power: 88 },
  { name: "Cowboys", city: "Dallas", conference: "NFC", power: 85 },
  { name: "Ravens", city: "Baltimore", conference: "AFC", power: 87 },
  { name: "Dolphins", city: "Miami", conference: "AFC", power: 82 },
  { name: "Lions", city: "Detroit", conference: "NFC", power: 84 }
]

export function NFLBettingSimulator() {
  const [team1, setTeam1] = useState<string>(NFL_TEAMS[0].name)
  const [team2, setTeam2] = useState<string>(NFL_TEAMS[1].name)
  const [betType, setBetType] = useState<BetType>("moneyline")
  const [betAmount, setBetAmount] = useState<string>("100")
  const [selectedTeam, setSelectedTeam] = useState<string>(team1)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const team1Data = NFL_TEAMS.find(t => t.name === team1)!
  const team2Data = NFL_TEAMS.find(t => t.name === team2)!

  // Calculate implied probability based on team strength
  const calculateWinProbability = (teamPower: number, opponentPower: number): number => {
    const powerDiff = teamPower - opponentPower
    // Logistic function for more realistic probability
    return 1 / (1 + Math.exp(-powerDiff / 10))
  }

  const team1WinProb = calculateWinProbability(team1Data.power, team2Data.power)
  const team2WinProb = 1 - team1WinProb

  // Convert probability to American odds
  const probabilityToAmericanOdds = (prob: number): number => {
    if (prob >= 0.5) {
      // Favorite (negative odds)
      return -Math.round((prob / (1 - prob)) * 100)
    } else {
      // Underdog (positive odds)
      return Math.round(((1 - prob) / prob) * 100)
    }
  }

  const team1Odds = probabilityToAmericanOdds(team1WinProb)
  const team2Odds = probabilityToAmericanOdds(team2WinProb)

  // Calculate spread (point difference)
  const spread = Math.round((team1Data.power - team2Data.power) / 3)

  // Calculate total (over/under)
  const totalPoints = Math.round(45 + (team1Data.power + team2Data.power - 170) / 5)

  // Convert American odds to decimal
  const americanToDecimal = (americanOdds: number): number => {
    if (americanOdds > 0) {
      return (americanOdds / 100) + 1
    } else {
      return (100 / Math.abs(americanOdds)) + 1
    }
  }

  // Calculate EV
  const calculateEV = (odds: number, winProb: number): number => {
    const decimalOdds = americanToDecimal(odds)
    const amount = parseFloat(betAmount) || 100
    return (winProb * amount * (decimalOdds - 1)) - ((1 - winProb) * amount)
  }

  const getBetOptions = (): BetOption[] => {
    switch (betType) {
      case "moneyline":
        return [
          {
            type: "moneyline",
            description: `${team1Data.city} ${team1Data.name}`,
            odds: team1Odds
          },
          {
            type: "moneyline",
            description: `${team2Data.city} ${team2Data.name}`,
            odds: team2Odds
          }
        ]
      case "spread":
        return [
          {
            type: "spread",
            description: `${team1Data.name} ${spread > 0 ? '+' : ''}${-spread}`,
            odds: -110,
            threshold: -spread
          },
          {
            type: "spread",
            description: `${team2Data.name} ${spread > 0 ? '+' : ''}${spread}`,
            odds: -110,
            threshold: spread
          }
        ]
      case "total":
        return [
          {
            type: "total",
            description: `Over ${totalPoints}`,
            odds: -110,
            threshold: totalPoints
          },
          {
            type: "total",
            description: `Under ${totalPoints}`,
            odds: -110,
            threshold: totalPoints
          }
        ]
    }
  }

  const simulateGame = () => {
    const amount = parseFloat(betAmount) || 100

    // Simulate game outcome
    const team1Score = Math.round(20 + (team1Data.power / 5) + (Math.random() * 14 - 7))
    const team2Score = Math.round(20 + (team2Data.power / 5) + (Math.random() * 14 - 7))
    const total = team1Score + team2Score
    const pointDiff = team1Score - team2Score

    let won = false
    let payout = 0

    const selectedOdds = selectedTeam === team1 ?
      (betType === "moneyline" ? team1Odds : -110) :
      (betType === "moneyline" ? team2Odds : -110)

    switch (betType) {
      case "moneyline":
        won = (selectedTeam === team1 && team1Score > team2Score) ||
              (selectedTeam === team2 && team2Score > team1Score)
        break
      case "spread":
        const coveredSpread = selectedTeam === team1 ?
          pointDiff > -spread :
          -pointDiff > spread
        won = coveredSpread
        break
      case "total":
        won = selectedTeam.includes("Over") ?
          total > totalPoints :
          total < totalPoints
        break
    }

    if (won) {
      const decimalOdds = americanToDecimal(selectedOdds)
      payout = amount * decimalOdds
    }

    setResult({
      betType,
      teamBet: selectedTeam,
      amount,
      won,
      payout,
      profit: won ? payout - amount : -amount
    })
    setShowAnalysis(true)
  }

  const betOptions = getBetOptions()
  const selectedBetOdds = selectedTeam === team1 ?
    (betType === "moneyline" ? team1Odds : -110) :
    (betType === "moneyline" ? team2Odds : -110)

  const winProb = betType === "moneyline" ?
    (selectedTeam === team1 ? team1WinProb : team2WinProb) :
    0.5 // Spread and totals are typically 50/50

  const ev = calculateEV(selectedBetOdds, winProb)

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Simulador NFL</h3>
            <p className="text-xs text-gray-400">Aprende sobre apuestas deportivas</p>
          </div>
        </div>

        {/* Team Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="team1" className="text-sm text-gray-300">Equipo Local</Label>
            <Select value={team1} onValueChange={setTeam1}>
              <SelectTrigger id="team1" className="bg-black/50 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {NFL_TEAMS.filter(t => t.name !== team2).map(team => (
                  <SelectItem key={team.name} value={team.name} className="text-white hover:bg-white/10">
                    {team.city} {team.name} ({team.power})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team2" className="text-sm text-gray-300">Equipo Visitante</Label>
            <Select value={team2} onValueChange={setTeam2}>
              <SelectTrigger id="team2" className="bg-black/50 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {NFL_TEAMS.filter(t => t.name !== team1).map(team => (
                  <SelectItem key={team.name} value={team.name} className="text-white hover:bg-white/10">
                    {team.city} {team.name} ({team.power})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Matchup Display */}
        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-white">{team1Data.city} {team1Data.name}</p>
              <p className="text-sm text-gray-400">Power: {team1Data.power}</p>
              <Badge variant="outline" className={cn("mt-2", team1WinProb > 0.5 ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400")}>
                {team1Odds > 0 ? '+' : ''}{team1Odds}
              </Badge>
            </div>
            <div className="px-4 text-gray-500 font-bold">VS</div>
            <div className="text-center flex-1">
              <p className="text-lg font-bold text-white">{team2Data.city} {team2Data.name}</p>
              <p className="text-sm text-gray-400">Power: {team2Data.power}</p>
              <Badge variant="outline" className={cn("mt-2", team2WinProb > 0.5 ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400")}>
                {team2Odds > 0 ? '+' : ''}{team2Odds}
              </Badge>
            </div>
          </div>
        </div>

        {/* Bet Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="betType" className="text-sm text-gray-300">Tipo de Apuesta</Label>
            <Select value={betType} onValueChange={(v) => setBetType(v as BetType)}>
              <SelectTrigger id="betType" className="bg-black/50 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="moneyline" className="text-white hover:bg-white/10">
                  Moneyline (Ganador directo)
                </SelectItem>
                <SelectItem value="spread" className="text-white hover:bg-white/10">
                  Point Spread (Hándicap)
                </SelectItem>
                <SelectItem value="total" className="text-white hover:bg-white/10">
                  Over/Under (Total puntos)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="betAmount" className="text-sm text-gray-300">Cantidad ($)</Label>
            <Input
              id="betAmount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
              placeholder="100"
            />
          </div>
        </div>

        {/* Bet Selection */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Selecciona tu apuesta</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {betOptions.map((option, index) => (
              <button
                key={option.description}
                onClick={() => setSelectedTeam(option.description)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  selectedTeam === option.description ?
                    "border-blue-500 bg-blue-500/10" :
                    "border-white/10 bg-black/30 hover:border-white/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{option.description}</span>
                  <Badge variant="outline" className="bg-white/5">
                    {option.odds > 0 ? '+' : ''}{option.odds}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 text-left">
                  {betType === "moneyline" && `Win prob: ${((option.description.includes(team1) ? team1WinProb : team2WinProb) * 100).toFixed(0)}%`}
                  {betType === "spread" && `Cover ${Math.abs(option.threshold!)} pts`}
                  {betType === "total" && option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* EV Analysis */}
        <div className={cn(
          "rounded-lg border p-4",
          ev > 0 ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
        )}>
          <div className="flex items-start gap-3">
            {ev > 0 ? (
              <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-1">Análisis de Valor Esperado</p>
              <p className={cn("text-2xl font-bold mb-2", ev > 0 ? "text-green-400" : "text-red-400")}>
                {ev >= 0 ? '+' : ''}${ev.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                {ev > 0
                  ? `Esta apuesta tiene valor positivo (+EV). Ganancia esperada por apuesta.`
                  : `Esta apuesta tiene valor negativo (-EV). Pérdida esperada a largo plazo.`}
              </p>
            </div>
          </div>
        </div>

        {/* Simulate Button */}
        <Button
          onClick={simulateGame}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Simular Partido
        </Button>

        {/* Results */}
        <AnimatePresence>
          {showAnalysis && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 pt-4 border-t border-white/10"
            >
              <div className={cn(
                "rounded-lg border p-6 text-center",
                result.won ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
              )}>
                {result.won ? (
                  <Target className="w-12 h-12 text-green-400 mx-auto mb-3" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                )}
                <h4 className={cn("text-2xl font-bold mb-2", result.won ? "text-green-400" : "text-red-400")}>
                  {result.won ? "¡Ganaste!" : "Perdiste"}
                </h4>
                <p className="text-gray-300 mb-4">
                  {result.won ? `Tu apuesta de $${result.amount} ganó` : `Perdiste $${result.amount}`}
                </p>
                {result.won && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-3xl font-bold text-green-400">
                        +${result.profit.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Pago total: ${result.payout.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs text-blue-300">
                  💡 Recuerda: Este resultado individual no refleja el valor esperado real. A largo plazo,
                  las apuestas con EV negativo te harán perder dinero incluso si ganas algunas veces.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

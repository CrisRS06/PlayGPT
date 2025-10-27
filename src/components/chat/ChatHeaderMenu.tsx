"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, MessageSquare, BookOpen, BarChart3, Calculator, Home, Flame, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { XPProgressBar } from "@/components/gamification/XPProgressBar"
import { StreakIndicator } from "@/components/gamification/StreakIndicator"
import { ModeToggle } from "@/components/learning/ModeToggle"

interface ChatHeaderMenuProps {
  onOpenHistorial: () => void
  onOpenAprendizaje: () => void
}

export function ChatHeaderMenu({ onOpenHistorial, onOpenAprendizaje }: ChatHeaderMenuProps) {
  const [open, setOpen] = useState(false)

  const handleHistorial = () => {
    onOpenHistorial()
    setOpen(false)
  }

  const handleAprendizaje = () => {
    onOpenAprendizaje()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="touch-target md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Menú</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          {/* Gamification Section */}
          <div className="space-y-3 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Trophy className="h-4 w-4" />
              <span>Tu Progreso</span>
            </div>
            <XPProgressBar />
            <StreakIndicator />
          </div>

          {/* Mode Toggle */}
          <div className="pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Modo de Aprendizaje</span>
              <ModeToggle />
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="justify-start gap-3 h-12 touch-target"
              asChild
            >
              <Link href="/" onClick={() => setOpen(false)}>
                <Home className="h-5 w-5" />
                <span>Inicio</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="justify-start gap-3 h-12 touch-target"
              onClick={handleHistorial}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Historial de Conversaciones</span>
            </Button>

            <Button
              variant="ghost"
              className="justify-start gap-3 h-12 touch-target"
              onClick={handleAprendizaje}
            >
              <BookOpen className="h-5 w-5" />
              <span>Ruta de Aprendizaje</span>
            </Button>

            <Separator className="my-2" />

            <Button
              variant="ghost"
              className="justify-start gap-3 h-12 touch-target"
              asChild
            >
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard de Progreso</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="justify-start gap-3 h-12 touch-target"
              asChild
            >
              <Link href="/tools" onClick={() => setOpen(false)}>
                <Calculator className="h-5 w-5" />
                <span>Herramientas</span>
              </Link>
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

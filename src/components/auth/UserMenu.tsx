"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"
import { logout } from "@/lib/auth/actions"
import Link from "next/link"

interface UserMenuProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario"
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      // Silent fail - logout will redirect regardless
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full hover:bg-white/5 transition-colors p-1"
        aria-label={isOpen ? "Cerrar menú de usuario" : "Abrir menú de usuario"}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-text-primary text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-xl shadow-xl z-50">
            <div className="p-3 border-b border-gray-200">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>

            <div className="p-2 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                asChild
              >
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                asChild
              >
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </Button>
            </div>

            <div className="p-2 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

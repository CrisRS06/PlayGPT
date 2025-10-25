"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface AuthFormProps {
  mode: "login" | "signup"
  onSubmit: (email: string, password: string, name?: string) => Promise<void>
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLogin = mode === "login"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const loadingMessage = isLogin ? "Iniciando sesión..." : "Creando cuenta..."
    toast.loading(loadingMessage, { id: "auth-action" })

    try {
      await onSubmit(email, password, name || undefined)
      // Success handled by parent component's redirect
      toast.dismiss("auth-action")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error"
      setError(errorMessage)
      toast.error(errorMessage, { id: "auth-action" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-gray-200 bg-gradient-to-br from-white to-white/5 backdrop-blur-xl">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl opacity-50" />
            <Sparkles className="relative h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-text-primary">
            {isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}
          </CardTitle>
          <CardDescription className="text-text-body">
            {isLogin
              ? "Ingresa tus credenciales para continuar"
              : "Regístrate para comenzar tu aprendizaje"}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-text-primary">
                Nombre completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                disabled={isLoading}
                className="bg-gray-100 border-gray-200 text-text-primary placeholder:text-text-secondary focus:border-primary/50"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
              Correo electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-gray-100 border-gray-200 text-text-primary placeholder:text-text-secondary focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-text-primary">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="bg-gray-100 border-gray-200 text-text-primary placeholder:text-text-secondary focus:border-primary/50"
            />
            {!isLogin && (
              <p className="text-xs text-text-body">
                Mínimo 6 caracteres
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : isLogin ? (
              "Iniciar sesión"
            ) : (
              "Crear cuenta"
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-text-body">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            </span>
            <Link
              href={isLogin ? "/auth/signup" : "/auth/login"}
              className="text-primary hover:text-accent font-medium transition-colors"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </Link>
          </div>

          {isLogin && (
            <div className="text-center">
              <Link
                href="/auth/reset-password"
                className="text-sm text-text-body hover:text-text-primary transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

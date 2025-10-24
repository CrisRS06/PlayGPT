/**
 * Environment-aware logger utility
 *
 * In development: logs to console
 * In production: suppresses logs (can be extended to send to logging service)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  debug: (message: string, ...args: unknown[]) => void
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
}

const isDevelopment = process.env.NODE_ENV === 'development'

class AppLogger implements Logger {
  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!isDevelopment) {
      // In production, only log errors (can extend to send to external service)
      if (level === 'error') {
        // TODO: Send to error tracking service (e.g., Sentry)
        console.error(`[${level.toUpperCase()}]`, message, ...args)
      }
      return
    }

    // In development, log everything
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args)
        break
      case 'info':
        console.info(prefix, message, ...args)
        break
      case 'warn':
        console.warn(prefix, message, ...args)
        break
      case 'error':
        console.error(prefix, message, ...args)
        break
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args)
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args)
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args)
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args)
  }
}

export const logger = new AppLogger()

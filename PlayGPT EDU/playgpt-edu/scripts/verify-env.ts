#!/usr/bin/env tsx

/**
 * Environment Variables Verification Script
 * Checks that all required environment variables are set
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local if it exists
config({ path: resolve(process.cwd(), '.env.local') })

const requiredEnvVars = {
  critical: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
  ],
  optional: [
    'NEXT_PUBLIC_APP_URL',
  ],
}

function verifyEnv() {
  console.log('🔍 Verificando variables de entorno...\n')

  let hasErrors = false
  let hasWarnings = false

  // Check critical variables
  console.log('📋 Variables CRÍTICAS:')
  requiredEnvVars.critical.forEach((varName) => {
    const value = process.env[varName]
    if (!value) {
      console.log(`  ❌ ${varName}: NO CONFIGURADA`)
      hasErrors = true
    } else if (value.includes('your_') || value.includes('tu_')) {
      console.log(`  ⚠️  ${varName}: Valor de placeholder detectado`)
      hasErrors = true
    } else {
      console.log(`  ✅ ${varName}: Configurada`)
    }
  })

  console.log('\n📋 Variables OPCIONALES:')
  requiredEnvVars.optional.forEach((varName) => {
    const value = process.env[varName]
    if (!value) {
      console.log(`  ⚠️  ${varName}: No configurada (usará default)`)
      hasWarnings = true
    } else {
      console.log(`  ✅ ${varName}: ${value}`)
    }
  })

  console.log('\n🔒 Verificaciones de seguridad:')

  // Check Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    if (!supabaseUrl.startsWith('https://')) {
      console.log('  ❌ SUPABASE_URL debe comenzar con https://')
      hasErrors = true
    } else if (!supabaseUrl.includes('.supabase.co')) {
      console.log('  ⚠️  SUPABASE_URL no parece ser una URL válida de Supabase')
      hasWarnings = true
    } else {
      console.log('  ✅ SUPABASE_URL tiene formato válido')
    }
  }

  // Check OpenAI API key format
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    if (!openaiKey.startsWith('sk-')) {
      console.log('  ❌ OPENAI_API_KEY debe comenzar con sk-')
      hasErrors = true
    } else {
      console.log('  ✅ OPENAI_API_KEY tiene formato válido')
    }
  }

  // Check service role key is not exposed
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const isInClientCode = false // En producción, revisar bundles
  if (serviceRoleKey && isInClientCode) {
    console.log('  ⚠️  ADVERTENCIA: service_role_key podría estar expuesta en código cliente')
    hasWarnings = true
  } else if (serviceRoleKey) {
    console.log('  ✅ SUPABASE_SERVICE_ROLE_KEY correctamente protegida')
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  if (hasErrors) {
    console.log('❌ VERIFICACIÓN FALLIDA - Configuración incompleta o incorrecta')
    console.log('\n📖 Consulta DEPLOYMENT.md para más información')
    process.exit(1)
  } else if (hasWarnings) {
    console.log('⚠️  VERIFICACIÓN CON ADVERTENCIAS - Revisa los warnings arriba')
    console.log('\n📖 Consulta DEPLOYMENT.md para más información')
    process.exit(0)
  } else {
    console.log('✅ VERIFICACIÓN EXITOSA - Todas las variables configuradas')
    process.exit(0)
  }
}

// Run verification
verifyEnv()

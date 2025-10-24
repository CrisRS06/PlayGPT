# 🔐 Sistema de Autenticación con Supabase - PlayGPT EDU

**Fecha:** 2025-01-22
**Estado:** Implementado y Funcional

---

## 📊 ARQUITECTURA GENERAL

PlayGPT EDU utiliza **Supabase Auth** como sistema completo de autenticación, con **Row Level Security (RLS)** para protección de datos a nivel de base de datos.

```
┌─────────────────────────────────────────────────────────────┐
│                      FLUJO DE AUTENTICACIÓN                  │
└─────────────────────────────────────────────────────────────┘

1. Usuario → Formulario (Login/Signup)
2. Client Component → Server Action
3. Server Action → Supabase Auth API
4. Supabase → Crea sesión (JWT + Cookie)
5. Proxy Middleware → Valida sesión en cada request
6. RLS Policies → Protegen datos en DB
```

---

## 🏗️ COMPONENTES DEL SISTEMA

### **1. Clientes de Supabase** (3 tipos)

#### **A) Browser Client** (`src/lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Uso:** Client Components (React)
**Propósito:** Interacciones desde el navegador
**Ejemplos:** Formularios de auth, queries en client side

---

#### **B) Server Client** (`src/lib/supabase/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) { /* ... */ }
      }
    }
  )
}
```

**Uso:** Server Components, Server Actions, Route Handlers
**Propósito:** Operaciones server-side con contexto de usuario
**Ejemplos:** Fetch de datos protegidos, mutations

---

#### **C) Admin Client** (`src/lib/supabase/admin.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

export function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Bypasses RLS
  )
}
```

**Uso:** Operaciones administrativas server-side
**Propósito:** Bypass RLS para operaciones privilegiadas
**⚠️ NUNCA exponer al browser**
**Ejemplos:** Ingestión de documentos, migraciones

---

### **2. Proxy Middleware** (`src/proxy.ts`)

Intercepta **todas las requests** para validar autenticación:

```typescript
export async function proxy(request: NextRequest) {
  // 1. Crear cliente Supabase con cookies
  const supabase = createServerClient(...)

  // 2. Validar sesión actual
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Proteger rutas
  const protectedPaths = ['/chat', '/profile', '/dashboard']

  if (isProtectedPath && !user) {
    // Redirect a login
    return NextResponse.redirect('/auth/login')
  }

  // 4. Evitar que usuarios autenticados accedan a auth pages
  if (isAuthPath && user) {
    return NextResponse.redirect('/chat')
  }

  return supabaseResponse
}
```

**Rutas protegidas:**
- `/chat` - Requiere autenticación
- `/profile` - Requiere autenticación
- `/dashboard` - Requiere autenticación
- `/quizzes` - Abierto (puede cambiar)

**Rutas de auth:**
- `/auth/login` - Redirige a /chat si ya autenticado
- `/auth/signup` - Redirige a /chat si ya autenticado

---

### **3. Server Actions** (`src/lib/auth/actions.ts`)

Operaciones de autenticación como Server Actions:

#### **Login**
```typescript
export async function login(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/", "layout")
  redirect("/chat")
}
```

#### **Signup**
```typescript
export async function signup(email: string, password: string, name?: string) {
  const supabase = await createClient()

  // 1. Crear usuario en Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  })

  if (error) throw new Error(error.message)

  // 2. Crear perfil de estudiante automáticamente
  if (data.user) {
    await supabase.from("student_profiles").insert({
      user_id: data.user.id,
      learning_style: "visual",
      level: "beginner",
      current_module: "Module_1_Foundations",
    })
  }

  redirect("/chat")
}
```

#### **Logout**
```typescript
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
```

#### **Password Reset**
```typescript
export async function resetPassword(email: string) {
  const supabase = await createClient()

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`
  })
}
```

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### **Tabla de Usuarios**

Supabase maneja automáticamente la tabla `auth.users`:

```sql
-- Gestionado por Supabase
auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  raw_user_meta_data JSONB -- Aquí va full_name, etc.
)
```

### **Tabla de Perfiles** (`student_profiles`)

Tabla custom para datos del estudiante:

```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users UNIQUE, -- ⭐ Link a auth
  level TEXT DEFAULT 'beginner',
  learning_style TEXT DEFAULT 'visual',
  current_module TEXT DEFAULT 'Module_1_Foundations',
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  knowledge_components JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Creación automática:** Al hacer signup, se crea el perfil automáticamente (líneas 42-54 de `actions.ts`)

---

## 🔒 ROW LEVEL SECURITY (RLS)

Cada tabla tiene políticas que protegen los datos:

### **Student Profiles Policies**

```sql
-- Ver solo tu propio perfil
CREATE POLICY "Users can view their own profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Actualizar solo tu propio perfil
CREATE POLICY "Users can update their own profile"
  ON student_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Insertar solo tu propio perfil
CREATE POLICY "Users can insert their own profile"
  ON student_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Función mágica:** `auth.uid()`
- Supabase expone la función `auth.uid()` en SQL
- Retorna el `user_id` del JWT actual
- Si no hay sesión, retorna `NULL`

### **Conversations Policies**

```sql
-- Ver solo tus conversaciones
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

-- Eliminar solo tus conversaciones
CREATE POLICY "Users can delete their own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);
```

### **Documents Policies** (Excepción)

```sql
-- Todos los usuarios autenticados pueden leer documentos
CREATE POLICY "Authenticated users can read documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);
```

**Razón:** Los documentos de la knowledge base son compartidos.

### **Otras tablas protegidas:**
- ✅ `quizzes` - Solo tus quizzes
- ✅ `quiz_attempts` - Solo tus intentos
- ✅ `knowledge_components` - Solo tu progreso
- ✅ `interactions` - Solo tu historial

---

## 🔑 FLUJO COMPLETO: SIGNUP

```
┌────────────────────────────────────────────────────────────┐
│                    FLUJO DE REGISTRO                        │
└────────────────────────────────────────────────────────────┘

1. Usuario completa formulario en /auth/signup
   - Email: test@example.com
   - Password: ******
   - Name: Juan Pérez

2. AuthForm → signup() Server Action

3. signup() hace 2 cosas:

   a) Crear usuario en Supabase Auth:
      → supabase.auth.signUp({ email, password })
      → Supabase crea:
         - Registro en auth.users
         - JWT token
         - Cookie de sesión

   b) Crear perfil de estudiante:
      → supabase.from("student_profiles").insert({
           user_id: data.user.id,
           level: "beginner",
           learning_style: "visual",
           ...
        })

4. Redirect a /chat
   → Usuario ya autenticado automáticamente

5. Proxy middleware valida en cada request:
   → Lee cookie de sesión
   → Valida JWT con Supabase
   → Permite acceso a /chat
```

---

## 🔑 FLUJO COMPLETO: LOGIN

```
┌────────────────────────────────────────────────────────────┐
│                   FLUJO DE LOGIN                            │
└────────────────────────────────────────────────────────────┘

1. Usuario completa formulario en /auth/login
   - Email: test@example.com
   - Password: ******

2. AuthForm → login() Server Action

3. login() hace:
   → supabase.auth.signInWithPassword({ email, password })
   → Supabase valida credenciales
   → Si correcto: crea sesión (JWT + Cookie)
   → Si incorrecto: throw Error

4. Redirect a /chat

5. Proxy middleware valida en futuras requests
```

---

## 🔑 FLUJO COMPLETO: LOGOUT

```
┌────────────────────────────────────────────────────────────┐
│                   FLUJO DE LOGOUT                           │
└────────────────────────────────────────────────────────────┘

1. Usuario hace clic en "Cerrar sesión"

2. logout() Server Action

3. logout() hace:
   → supabase.auth.signOut()
   → Supabase invalida JWT
   → Elimina cookie de sesión

4. Redirect a /

5. Proxy middleware detecta ausencia de sesión:
   → Si intenta acceder a /chat → redirect a /auth/login
```

---

## 🔐 SEGURIDAD: JWT Y COOKIES

### **JWT (JSON Web Token)**

Supabase genera un JWT que contiene:

```json
{
  "sub": "user-uuid-here",
  "email": "test@example.com",
  "role": "authenticated",
  "aud": "authenticated",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Almacenamiento:** Cookie HTTP-only
**Expiración:** Configurable (default: 1 hora)
**Refresh:** Automático via `proxy.ts`

### **Cookie Settings**

```typescript
// Supabase maneja automáticamente:
{
  httpOnly: true,      // No accesible desde JS
  secure: true,        // Solo HTTPS en producción
  sameSite: "lax",     // Protección CSRF
  path: "/",
  maxAge: 3600         // 1 hora
}
```

---

## 🛡️ PROTECCIONES IMPLEMENTADAS

### ✅ **1. Row Level Security (RLS)**
- Cada tabla tiene políticas activas
- Users solo acceden a sus propios datos
- Protección a nivel de DB (no bypasseable desde frontend)

### ✅ **2. Proxy Middleware**
- Valida autenticación en cada request
- Redirect automático a login si no autenticado
- Refresh automático de tokens

### ✅ **3. Server Actions**
- Autenticación solo server-side
- No expone credenciales al browser
- Validación de errores

### ✅ **4. Separated Clients**
- Browser client: Solo operaciones permitidas
- Server client: Contexto de usuario
- Admin client: NUNCA expuesto al browser

### ✅ **5. Environment Variables**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co  # ✅ Pública
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx                 # ✅ Pública (RLS protect)
SUPABASE_SERVICE_ROLE_KEY=xxx                     # 🔒 SECRETA (bypasses RLS)
```

---

## 📝 EJEMPLO DE USO EN CÓDIGO

### **Server Component** (Obtener datos del usuario)

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()

  // 1. Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Obtener perfil (RLS protege automáticamente)
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return <div>Hola {profile.learning_style}!</div>
}
```

### **Client Component** (Mutation)

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export function UpdateProfileButton() {
  const handleUpdate = async () => {
    const supabase = createClient()

    // RLS asegura que solo actualices tu perfil
    await supabase
      .from('student_profiles')
      .update({ level: 'advanced' })
      .eq('user_id', user.id)
  }

  return <button onClick={handleUpdate}>Update</button>
}
```

---

## 🚨 ERRORES COMUNES

### **1. "Failed to refresh token"**
**Causa:** Token expirado y refresh falló
**Solución:** Usuario debe re-login

### **2. "Row Level Security policy violated"**
**Causa:** Intentando acceder a datos de otro usuario
**Solución:** Verificar query (usar auth.uid())

### **3. "User not authenticated"**
**Causa:** No hay sesión activa
**Solución:** Redirect a /auth/login (proxy lo hace automáticamente)

---

## 📚 TABLAS Y RELACIONES

```
auth.users (Supabase)
    ↓ (1:1)
student_profiles
    ↓ (1:N)
├── conversations
├── quizzes
│   └── quiz_attempts
├── knowledge_components
└── interactions
```

**Todas las tablas** (excepto documents) tienen:
- `user_id UUID REFERENCES auth.users`
- RLS policies que usan `auth.uid()`

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- ✅ **Supabase Auth configurado**
- ✅ **3 clientes (browser, server, admin)**
- ✅ **Proxy middleware con protección de rutas**
- ✅ **Server Actions para auth**
- ✅ **RLS habilitado en todas las tablas**
- ✅ **Policies para cada operación**
- ✅ **Signup crea perfil automáticamente**
- ✅ **Login/Logout funcionando**
- ✅ **Password reset implementado**
- ✅ **Cookies HTTP-only**
- ✅ **JWT refresh automático**

---

## 🎯 RESUMEN

**PlayGPT EDU usa Supabase Auth como sistema completo de autenticación:**

1. **Supabase Auth** maneja usuarios, sesiones y JWT
2. **Proxy middleware** protege rutas y valida sesiones
3. **RLS policies** protegen datos a nivel de DB
4. **Server Actions** manejan operaciones de auth
5. **3 clientes** separados por contexto (browser/server/admin)
6. **Signup automático** crea perfil de estudiante
7. **Todo protegido** con HTTP-only cookies y JWT

**Es un sistema robusto, seguro y production-ready.** 🔒✅

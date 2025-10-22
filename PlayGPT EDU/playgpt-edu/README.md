# PlayGPT EDU 🎓

> Plataforma educativa avanzada con IA para enseñar conceptos de juego responsable a través de aprendizaje adaptativo y generación dinámica de contenido.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

## 🎯 Descripción

PlayGPT EDU es una plataforma educativa que utiliza **Retrieval-Augmented Generation (RAG)** y **modelos de lenguaje avanzados** para proporcionar educación personalizada sobre:

- 🎲 Probabilidad y valor esperado
- 🧠 Sesgos cognitivos en el juego
- 💰 Gestión de bankroll
- 📊 Toma de decisiones informadas

### Características Principales

- **🤖 RAG System**: Búsqueda vectorial con embeddings de OpenAI
- **💬 Chat Inteligente**: Conversaciones contextuales con IA
- **📝 Generación de Quizzes**: Evaluaciones dinámicas con Bloom's Taxonomy
- **📊 Aprendizaje Adaptativo**: Tracking de Knowledge Components
- **🌐 Multilenguaje**: Soporte para Español e Inglés
- **🎨 UI Moderna**: Diseño profesional con Tailwind CSS 4

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+ o Bun
- pnpm (recomendado) o npm
- Cuenta de Supabase
- OpenAI API Key

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd playgpt-edu
```

2. **Instalar dependencias**
```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**

Copia `.env.example` a `.env.local` y completa las credenciales:

```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=tu_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Configurar base de datos**

Ejecuta el SQL schema en tu proyecto de Supabase:
```bash
# El archivo supabase-schema.sql contiene todo el schema
# Ejecútalo en el SQL Editor de Supabase Dashboard
```

5. **Verificar conexión a base de datos**
```bash
pnpm verify:db
```

6. **Ingestar documentos de conocimiento**
```bash
pnpm ingest
```

7. **Iniciar servidor de desarrollo**
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
playgpt-edu/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Landing page
│   │   ├── chat/                # Páginas de chat
│   │   ├── globals.css          # Estilos globales
│   │   └── api/                 # API Routes
│   │       └── search/          # Endpoint de búsqueda RAG
│   │
│   ├── components/
│   │   ├── ui/                  # Componentes UI base (Radix + Tailwind)
│   │   ├── chat/                # Componentes de chat
│   │   └── landing/             # Componentes de landing
│   │
│   ├── lib/
│   │   ├── rag/                 # Sistema RAG
│   │   │   ├── ingest.ts       # Pipeline de ingesta
│   │   │   └── search.ts       # Búsqueda vectorial
│   │   ├── supabase/            # Clientes de Supabase
│   │   │   ├── client.ts       # Cliente browser
│   │   │   ├── server.ts       # Cliente server
│   │   │   └── admin.ts        # Cliente admin
│   │   └── utils.ts             # Utilidades
│   │
│   └── types/
│       └── supabase.ts          # Tipos generados de Supabase
│
├── scripts/                      # Scripts de utilidad
│   ├── ingest-documents.ts      # Ingesta de documentos
│   ├── test-rag-search.ts       # Test de búsqueda
│   ├── verify-supabase.ts       # Verificación de DB
│   └── verify-embeddings.ts     # Verificación de embeddings
│
├── knowledge-base/               # Base de conocimiento
│   ├── expected-value.md        # Valor esperado
│   ├── probability-basics.md    # Probabilidad
│   ├── cognitive-biases.md      # Sesgos cognitivos
│   └── bankroll-management.md   # Gestión de bankroll
│
├── .env.example                  # Template de variables de entorno
├── supabase-schema.sql          # Schema de base de datos
└── package.json                  # Dependencias y scripts
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo
pnpm build            # Compilar para producción
pnpm start            # Iniciar servidor de producción
pnpm lint             # Ejecutar linter

# Base de Datos
pnpm verify:db        # Verificar conexión a Supabase
pnpm generate:types   # Generar tipos de TypeScript desde Supabase

# RAG System
pnpm ingest           # Ingestar documentos de knowledge-base/
pnpm test:search      # Probar búsqueda vectorial
```

## 🗄️ Base de Datos

### Tablas Principales

- **documents**: Chunks de documentos con embeddings vectoriales
- **student_profiles**: Perfiles de estudiantes con estilos de aprendizaje
- **conversations**: Historial de conversaciones
- **quizzes**: Quizzes generados dinámicamente
- **quiz_attempts**: Intentos y evaluaciones de quizzes
- **knowledge_components**: Knowledge Tracing (BKT)
- **interactions**: Tracking de uso e interacciones

### Funciones RPC

- **match_documents**: Búsqueda de similitud vectorial (pgvector)

## 🤖 Sistema RAG

### Pipeline de Ingesta

1. **Carga de documentos**: PDF, TXT, MD
2. **Chunking**: RecursiveCharacterTextSplitter (1000 chars, 200 overlap)
3. **Embeddings**: OpenAI text-embedding-3-small (1536 dimensiones)
4. **Almacenamiento**: Supabase con pgvector

### Búsqueda Vectorial

```typescript
import { searchDocuments } from '@/lib/rag/search'

const results = await searchDocuments('What is expected value?', {
  matchThreshold: 0.7,
  matchCount: 5,
  filterModule: 'Module_1_Foundations'
})
```

### API Endpoint

```bash
# GET
curl "http://localhost:3000/api/search?q=probability&count=3"

# POST
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What is expected value?", "format": "context"}'
```

## 🎨 Stack Tecnológico

### Core
- **Next.js 16** - Framework React con App Router y Turbopack
- **React 19** - Biblioteca UI
- **TypeScript 5** - Lenguaje tipado

### UI/Styling
- **Tailwind CSS 4** - Framework de utilidades CSS con OKLCH
- **Radix UI** - Componentes accesibles primitivos
- **Lucide React** - Iconos modernos

### IA/ML
- **OpenAI SDK** - Embeddings y chat completions
- **Anthropic SDK** - Claude models
- **Vercel AI SDK** - Streaming y utilidades de IA
- **LangChain** - Text splitters y utilities

### Base de Datos
- **Supabase** - PostgreSQL + pgvector
- **pgvector** - Vector similarity search

## 🔐 Seguridad

- ✅ Variables de entorno en `.env.local` (no commitear)
- ✅ Service role key solo en scripts server-side
- ✅ Validación de input en API routes
- ⚠️ Implementar Row Level Security (RLS) en Supabase
- ⚠️ Agregar rate limiting en APIs públicas
- ⚠️ Implementar autenticación de usuarios

## 🚧 Roadmap

### Fase 1: Fundamentos ✅
- [x] Setup de proyecto
- [x] Sistema RAG funcional
- [x] Base de datos con schema completo
- [x] Scripts de ingesta y testing

### Fase 2: UI Moderna (En Progreso)
- [ ] Landing page profesional
- [ ] Interfaz de chat con streaming
- [ ] Sistema de autenticación
- [ ] Dashboard de estudiante

### Fase 3: Funcionalidades Avanzadas
- [ ] Generación dinámica de quizzes
- [ ] Knowledge Tracing (BKT)
- [ ] Aprendizaje adaptativo
- [ ] Analytics y reportes

### Fase 4: Producción
- [ ] Tests automatizados
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con Sentry
- [ ] Deploy a Vercel

## 🧪 Testing

```bash
# Verificar sistema completo
pnpm verify:db && pnpm test:search

# Test manual de RAG
pnpm test:search
```

### Tests Planificados
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración (Supabase)
- [ ] Tests E2E (Playwright)
- [ ] Tests de carga

## 📈 Performance

- ✅ Turbopack para desarrollo rápido
- ✅ Lazy loading de clientes OpenAI
- ✅ Batch processing en ingesta
- ✅ Vector indexing con pgvector
- ⚠️ Implementar caching de búsquedas
- ⚠️ Optimizar tamaño de bundles
- ⚠️ Implementar ISR para contenido estático

## 🤝 Contribución

Este es un proyecto privado en desarrollo. Para contribuir:

1. Crea una branch desde `main`
2. Implementa tus cambios
3. Ejecuta `pnpm lint` y `pnpm build`
4. Crea un Pull Request

## 📝 Licencia

Privado - Todos los derechos reservados © 2025 PlayGPT EDU Team

## 🆘 Soporte

Para problemas o preguntas:
- Revisar la [documentación de Next.js](https://nextjs.org/docs)
- Revisar la [documentación de Supabase](https://supabase.com/docs)
- Contactar al equipo de desarrollo

## 🔗 Enlaces Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

---

**Hecho con ❤️ por el equipo de PlayGPT EDU**

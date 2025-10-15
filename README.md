# PlayGPT

> Tu asistente personal impulsado por IA para aprender sobre juego responsable, autoexclusión y prevención de ludopatía.

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)
- [Despliegue](#despliegue)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Roadmap](#roadmap)
- [Contribución](#contribución)

## Características

- **Landing Page moderna**: Hero, features, CTA y footer responsive
- **Chat full-screen**: Interfaz dedicada para conversaciones con el bot
- **Integración con Botpress**: Conexión nativa con Botpress Cloud
- **UI personalizable**: Componentes con Shadcn/ui y Tailwind CSS
- **SEO optimizado**: Metadata, Open Graph, y Twitter Cards
- **TypeScript**: Type safety en todo el proyecto
- **Mobile-first**: Diseño responsive para todos los dispositivos
- **Preparado para escalar**: Arquitectura lista para evolucionar a SaaS

## Stack Tecnológico

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes**: [Shadcn/ui](https://ui.shadcn.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Bot Platform**: [Botpress Cloud](https://botpress.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.17 o superior
- **npm**, **yarn**, o **pnpm**
- Un bot configurado en [Botpress Cloud](https://botpress.com/)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/playgpt.git
cd playgpt
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
```

## Configuración

### 1. Obtén tu Client ID de Botpress

1. Ve a [Botpress Cloud](https://botpress.com/admin)
2. Selecciona tu bot
3. Ve a **Integrations** → **Webchat**
4. Copia el **Client ID** (también llamado Bot ID)

### 2. Configura las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tu Client ID:

```bash
NEXT_PUBLIC_BOTPRESS_CLIENT_ID=tu_client_id_aqui
NEXT_PUBLIC_BOTPRESS_HOST_URL=https://cdn.botpress.cloud/webchat/v2
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=PlayGPT
```

### 3. Personaliza tu sitio (opcional)

Edita `src/config/site.ts` para cambiar:
- Nombre del sitio
- Descripción
- URL
- Metadata SEO

Edita `src/config/botpress.ts` para personalizar:
- Colores del tema
- Nombre del bot
- Avatar del bot

## Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

La aplicación se recargará automáticamente cuando edites los archivos.

### Páginas disponibles

- `/` - Landing page
- `/chat` - Interfaz de chat con el bot

## Despliegue

### Opción 1: Vercel (Recomendado)

#### Desde la interfaz web:

1. Push tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) y haz login
3. Click en **Add New** → **Project**
4. Importa tu repositorio de GitHub
5. Configura las variables de entorno:
   - `NEXT_PUBLIC_BOTPRESS_CLIENT_ID`
   - `NEXT_PUBLIC_SITE_URL`
6. Click en **Deploy**

#### Desde la CLI:

```bash
# Instala Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Opción 2: Otros servicios

El proyecto también puede desplegarse en:

- **Netlify**: `npm run build && netlify deploy --prod --dir=.next`
- **Cloudflare Pages**: Compatible con adaptador de Next.js
- **Railway**: Deploy automático desde GitHub
- **Docker**: Incluye Dockerfile (próximamente)

### Configuración de dominio custom

#### En Vercel:

1. Ve a tu proyecto → **Settings** → **Domains**
2. Click en **Add Domain**
3. Ingresa tu dominio (ej: `playgpt.ai`)
4. Sigue las instrucciones para configurar los DNS:
   - Type: `A`, Name: `@`, Value: `76.76.19.19`
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`
5. SSL se configurará automáticamente en ~24h

## Estructura del Proyecto

```
playgpt/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Landing page (/)
│   │   ├── chat/
│   │   │   └── page.tsx        # Página de chat (/chat)
│   │   └── globals.css         # Estilos globales
│   │
│   ├── components/
│   │   ├── ui/                 # Componentes de Shadcn
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── landing/            # Componentes de landing
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── Footer.tsx
│   │   └── chat/               # Componentes de chat
│   │       ├── BotpressChat.tsx
│   │       ├── ChatHeader.tsx
│   │       └── ChatContainer.tsx
│   │
│   ├── lib/
│   │   └── utils.ts            # Utilidades (cn, etc.)
│   │
│   └── config/
│       ├── site.ts             # Configuración del sitio
│       └── botpress.ts         # Configuración de Botpress
│
├── public/                     # Archivos estáticos
├── .env.example                # Template de variables de entorno
├── next.config.ts              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Build para producción
npm run start        # Inicia servidor de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## Personalización

### Colores y Tema

Edita `src/app/globals.css` para cambiar los colores del tema:

```css
:root {
  --primary: 142 71% 45%;      /* Verde principal */
  --secondary: 217 91% 60%;    /* Azul secundario */
  --accent: 45 93% 58%;        /* Amarillo acento */
}
```

### Componentes UI

Los componentes de Shadcn están en `src/components/ui/`.
Para agregar más componentes:

```bash
npx shadcn-ui@latest add [component-name]
```

Componentes disponibles en [ui.shadcn.com](https://ui.shadcn.com/docs/components)

## Roadmap

### Fase 1: MVP (Actual)
- [x] Landing page
- [x] Integración con Botpress
- [x] Chat interface
- [x] Deployment básico

### Fase 2: Autenticación y Persistencia
- [ ] Login/Signup (NextAuth.js o Clerk)
- [ ] Base de datos (Supabase/Planetscale)
- [ ] Historial de conversaciones
- [ ] Perfil de usuario

### Fase 3: Analytics
- [ ] Google Analytics / PostHog
- [ ] Métricas de conversación
- [ ] Dashboard de estadísticas
- [ ] A/B testing

### Fase 4: SaaS Features
- [ ] Planes de suscripción (Stripe)
- [ ] Sistema de afiliados
- [ ] API para integraciones
- [ ] Simuladores interactivos

### Fase 5: AI Avanzado
- [ ] RAG con Vector DB
- [ ] Personalización de respuestas
- [ ] Modelos de predicción de riesgo
- [ ] Fine-tuning

## Seguridad

- ✅ Variables de entorno con `NEXT_PUBLIC_` para públicas
- ✅ Headers de seguridad configurados en `next.config.ts`
- ✅ `.env.local` en `.gitignore`
- ⚠️ Nunca commitees secrets privados
- ⚠️ Implementa rate limiting en producción
- ⚠️ Configura CORS correctamente

## Troubleshooting

### El chat no se carga

1. Verifica que `NEXT_PUBLIC_BOTPRESS_CLIENT_ID` esté configurado
2. Revisa la consola del navegador para errores
3. Asegúrate que tu bot esté publicado en Botpress Cloud

### Errores de TypeScript

```bash
# Limpia el cache de TypeScript
rm -rf .next
npm run build
```

### Build falla

1. Verifica que todas las dependencias estén instaladas
2. Asegúrate de usar Node.js 18.17+
3. Ejecuta `npm install` de nuevo

## Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y confidencial.

## Contacto

Christian Ramirez - [@tu_twitter](https://twitter.com/tu_twitter)

Project Link: [https://github.com/tu-usuario/playgpt](https://github.com/tu-usuario/playgpt)

---

**Nota importante**: PlayGPT es una herramienta educativa de IA y no reemplaza la ayuda profesional. Si necesitas apoyo urgente, contacta a un profesional de la salud mental o llama a una línea de ayuda especializada en ludopatía.

---

Hecho con ❤️ para promover el juego responsable

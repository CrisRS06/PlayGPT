# Comandos Útiles - PlayGPT

Referencia rápida de todos los comandos disponibles en el proyecto.

## 📦 Gestión de Dependencias

```bash
# Instalar todas las dependencias
npm install

# Actualizar dependencias
npm update

# Auditar seguridad
npm audit

# Corregir vulnerabilidades automáticamente
npm audit fix

# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo (http://localhost:3000)
npm run dev

# Iniciar en un puerto específico
PORT=3001 npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción (después de build)
npm run start

# Limpiar build anterior
rm -rf .next
```

## 🧹 Calidad de Código

```bash
# Ejecutar linter (ESLint)
npm run lint

# Auto-fix de problemas de linting
npm run lint -- --fix

# Formatear código con Prettier
npm run format

# Verificar formato sin cambiar archivos
npm run format:check

# TypeScript type check (sin build)
npx tsc --noEmit
```

## 🎨 Agregar Componentes Shadcn

```bash
# Agregar un componente específico
npx shadcn-ui@latest add [nombre]

# Ejemplos populares:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add avatar

# Ver todos los componentes disponibles
npx shadcn-ui@latest
```

## 🚢 Deployment

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs [deployment-url]

# Agregar variable de entorno
vercel env add NEXT_PUBLIC_BOTPRESS_CLIENT_ID production

# Ver lista de deployments
vercel ls

# Alias a un dominio
vercel alias [deployment-url] [domain]
```

### Git

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit - PlayGPT MVP"
git branch -M main

# Conectar a GitHub
git remote add origin https://github.com/tu-usuario/playgpt.git
git push -u origin main

# Commits subsecuentes
git add .
git commit -m "feat: add new feature"
git push
```

## 🔍 Debugging y Análisis

```bash
# Analizar bundle size
npm run build
npx @next/bundle-analyzer

# Ver árbol de dependencias
npm ls

# Ver dependencias desactualizadas
npm outdated

# Verificar que archivos serán incluidos en el deploy
ls -la
cat .gitignore

# Ver estructura del build
ls -lh .next/static
du -sh .next
```

## 🧪 Testing (Futuro)

```bash
# Cuando implementes tests:

# Ejecutar todos los tests
npm test

# Tests en watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Tests de un archivo específico
npm test -- ComponentName.test.tsx
```

## 📊 Performance y SEO

```bash
# Lighthouse audit (requiere Chrome)
npx lighthouse http://localhost:3000 --view

# Next.js bundle analyzer
ANALYZE=true npm run build

# Verificar SEO
curl -s http://localhost:3000 | grep -i "meta"
```

## 🔧 Mantenimiento

```bash
# Limpiar todo (node_modules, .next, etc.)
npm run clean  # Si agregas script en package.json

# O manualmente:
rm -rf node_modules .next out
npm install

# Verificar versión de Node.js
node -v

# Verificar versión de npm
npm -v

# Actualizar npm
npm install -g npm@latest
```

## 📝 Variables de Entorno

```bash
# Crear archivo de entorno desde template
cp .env.example .env.local

# Ver variables de entorno (producción en Vercel)
vercel env ls

# Agregar variable
vercel env add [NAME] [environment]

# Eliminar variable
vercel env rm [NAME] [environment]

# Pull variables de Vercel a local
vercel env pull .env.local
```

## 🎯 Scripts Personalizados

Agrega estos scripts a `package.json` si quieres:

```json
{
  "scripts": {
    "clean": "rm -rf .next out node_modules",
    "clean:build": "rm -rf .next out",
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true npm run build",
    "preview": "npm run build && npm run start"
  }
}
```

## 🐛 Troubleshooting Commands

```bash
# Si el servidor no inicia:
lsof -ti:3000 | xargs kill -9  # macOS/Linux
# o
npx kill-port 3000  # Windows/Mac/Linux

# Si hay errores de cache:
rm -rf .next/cache
npm run dev

# Si TypeScript está confundido:
rm -rf .next
npx tsc --noEmit

# Si npm install falla:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Ver logs detallados de npm
npm run dev --verbose
```

## 📚 Comandos de Información

```bash
# Ver información del proyecto
npm run

# Ver package.json
cat package.json

# Ver versión de Next.js
npx next --version

# Ver info del sistema
npx envinfo --system --binaries --browsers

# Ver puertos en uso
lsof -i -P | grep LISTEN  # macOS/Linux
netstat -ano | findstr LISTENING  # Windows
```

## 🔄 Workflow Típico de Desarrollo

```bash
# 1. Iniciar desarrollo
npm run dev

# 2. Hacer cambios en el código...

# 3. Verificar formato y linting
npm run format
npm run lint

# 4. Hacer commit
git add .
git commit -m "feat: add feature X"

# 5. Push a GitHub
git push

# 6. Auto-deploy en Vercel (si está configurado)
# O manualmente:
vercel --prod
```

## 🎨 Personalización Rápida

```bash
# Cambiar colores del tema
nano src/app/globals.css

# Cambiar configuración del sitio
nano src/config/site.ts

# Cambiar configuración de Botpress
nano src/config/botpress.ts

# Ver todos los componentes
find src/components -name "*.tsx" -type f
```

## 📖 Ayuda Adicional

```bash
# Next.js help
npx next --help

# Ver comandos de npm disponibles
npm run

# Documentación en línea
open https://nextjs.org/docs
open https://botpress.com/docs
open https://tailwindcss.com/docs
```

---

**Tip**: Guarda este archivo en favoritos para tener acceso rápido a todos los comandos.

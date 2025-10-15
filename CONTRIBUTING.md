# Guía de Contribución - PlayGPT

Gracias por tu interés en contribuir a PlayGPT. Este documento te guiará a través del proceso.

## Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso y colaborativo.

## Cómo Contribuir

### 1. Reportar Bugs

Si encuentras un bug, por favor abre un issue con:

- **Descripción clara** del problema
- **Pasos para reproducir** el bug
- **Comportamiento esperado** vs **comportamiento actual**
- **Screenshots** si es aplicable
- **Información del entorno** (navegador, OS, versión de Node.js)

### 2. Sugerir Features

Para sugerir nuevas funcionalidades:

1. Abre un issue con el tag `enhancement`
2. Describe claramente el feature y su utilidad
3. Explica por qué sería valioso para el proyecto
4. Si es posible, incluye mockups o ejemplos

### 3. Pull Requests

#### Proceso:

1. **Fork** el repositorio
2. **Crea una rama** desde `main`:
   ```bash
   git checkout -b feature/nombre-del-feature
   ```
3. **Haz tus cambios** siguiendo las convenciones de código
4. **Commit** tus cambios con mensajes descriptivos
5. **Push** a tu fork
6. **Abre un Pull Request** hacia `main`

#### Convenciones de commits:

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agrega nueva funcionalidad
fix: corrige un bug
docs: cambios en documentación
style: cambios de formato (no afectan código)
refactor: refactorización de código
test: agrega o modifica tests
chore: cambios en build, CI, etc.
```

Ejemplos:
```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve chat loading issue"
git commit -m "docs: update README with new setup instructions"
```

## Guía de Estilo

### TypeScript

- Usa TypeScript estricto
- Define tipos e interfaces explícitas
- Evita usar `any`
- Prefiere `interface` sobre `type` para objetos

### React/Next.js

- Usa componentes funcionales con hooks
- Prefiere `const` sobre `function` para componentes
- Usa `'use client'` solo cuando sea necesario
- Server Components por defecto

### Naming Conventions

```typescript
// Componentes: PascalCase
function MyComponent() {}

// Funciones: camelCase
function handleSubmit() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Tipos/Interfaces: PascalCase
interface UserProfile {}
type ButtonVariant = 'primary' | 'secondary';
```

### Estructura de archivos

```
src/
  components/
    ComponentName/
      ComponentName.tsx
      ComponentName.test.tsx
      index.ts
```

## Testing

Antes de abrir un PR:

```bash
# Lint
npm run lint

# Build
npm run build

# Tests (cuando estén implementados)
npm test
```

## Checklist para Pull Requests

- [ ] El código sigue las convenciones de estilo
- [ ] Los commits siguen Conventional Commits
- [ ] He actualizado la documentación si es necesario
- [ ] He agregado tests si es aplicable
- [ ] El build pasa sin errores
- [ ] He testeado los cambios localmente
- [ ] Los cambios son responsive (mobile/desktop)
- [ ] He actualizado el CHANGELOG si es necesario

## Áreas donde Necesitamos Ayuda

- 🎨 **UI/UX**: Mejoras en diseño y experiencia de usuario
- 🐛 **Bug Fixes**: Corrección de bugs reportados
- 📝 **Documentación**: Mejoras en README, tutoriales, etc.
- ✨ **Features**: Implementación de nuevas funcionalidades
- 🧪 **Testing**: Agregar tests unitarios e integración
- ♿ **Accesibilidad**: Mejoras en a11y
- 🌐 **i18n**: Internacionalización y traducciones

## Preguntas

Si tienes preguntas, puedes:

- Abrir un issue con el tag `question`
- Contactar al equipo de desarrollo

Gracias por contribuir a PlayGPT!

# 👤 Guía del Usuario - PlayGPT EDU

**Versión:** 2.0
**Fecha:** 2025-01-22
**Para:** Usuarios finales de PlayGPT EDU

---

## 🎯 ¿Qué es PlayGPT EDU?

PlayGPT EDU es una plataforma educativa con inteligencia artificial que te enseña sobre **juego responsable** de manera personalizada. La IA adapta el contenido a tu nivel de conocimiento y estilo de aprendizaje.

---

## 🚀 PASO 1: Landing Page (Primera Visita)

### **URL:** `http://localhost:3001/`

### **¿Qué ves?**

#### **1. Hero Section (Parte Superior)**
- **Título principal:** "Aprende Juego Responsable con IA"
- **Descripción:** Explicación breve del propósito
- **Botones de acción:**
  - 🟣 **"Comenzar Ahora"** → Te lleva a crear cuenta
  - 🔵 **"Saber Más"** → Scroll a Features
- **Estadísticas:**
  - 98% de satisfacción
  - 15,000+ estudiantes
  - 50+ módulos

#### **2. Features Section**
Scroll hacia abajo para ver las características principales:

**🤖 Tutor IA Personalizado**
- Chatbot inteligente que se adapta a tu nivel
- Responde preguntas en tiempo real
- Aprende de tus interacciones

**📊 Sistema de Evaluación**
- Quizzes personalizados según tu progreso
- Retroalimentación inmediata
- Análisis de fortalezas y debilidades

**📈 Seguimiento de Progreso**
- Dashboard con métricas detalladas
- Visualización de mastery por tema
- Historial de conversaciones

**🎓 Contenido Curado**
- Base de conocimiento experta
- Módulos estructurados progresivamente
- Contenido verificado por especialistas

#### **3. Modules Section**
Previsualización de los módulos disponibles:

**Módulo 1: Fundamentos**
- 📊 Valor Esperado (EV)
- 💡 Probabilidad Básica
- 🧠 Sesgos Cognitivos (Gambler's Fallacy, Hot Hand Fallacy)
- 💰 Gestión de Bankroll (Kelly Criterion)

*(Más módulos visibles en el scroll)*

#### **4. Footer**
- Copyright © 2025 PlayGPT EDU
- Powered by IA responsable

---

## 🔐 PASO 2: Crear Cuenta

### **URL:** `http://localhost:3001/auth/signup`

### **Flujo de Registro:**

1. **Click en "Comenzar Ahora"** desde la landing page
2. **Formulario de registro:**
   - 📝 **Nombre completo:** Tu nombre (ej: "Juan Pérez")
   - ✉️ **Correo electrónico:** tu@email.com
   - 🔒 **Contraseña:** Mínimo 6 caracteres

3. **Click en "Crear cuenta"**
   - Verás un toast: "Creando cuenta..."
   - El sistema crea tu usuario en Supabase
   - Se crea automáticamente tu perfil de estudiante con:
     - Nivel: Principiante (beginner)
     - Estilo de aprendizaje: Visual
     - Módulo actual: Module_1_Foundations

4. **Redirección automática a `/chat`**
   - Toast de éxito: "¡Cuenta creada exitosamente!"

### **¿Ya tienes cuenta?**
- Link "Inicia sesión" te lleva a `/auth/login`

---

## 💬 PASO 3: Chat con la IA

### **URL:** `http://localhost:3001/chat`

Esta es **la página principal** de aprendizaje. Aquí pasarás la mayor parte del tiempo.

### **Layout de la Página:**

```
┌─────────────────────────────────────────────────────┐
│ [☰] PlayGPT EDU      [📊 Dashboard] [👤 Perfil]    │ Header
├─────────────────────────────────────────────────────┤
│ 📋 Conversaciones │  💬 Chat Principal             │
│                   │                                 │
│ • Conversación 1  │  🤖 ¡Hola! Soy tu tutor...     │
│ • Conversación 2  │                                 │
│ • Conversación 3  │  👤 ¿Qué es el valor...?       │
│                   │                                 │
│ [+ Nueva]         │  🤖 El valor esperado es...    │
│                   │                                 │
│                   │  ┌──────────────────────────┐  │
│                   │  │ Escribe tu pregunta...   │  │
│                   │  └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### **Componentes del Chat:**

#### **1. Header (Superior)**
- **Izquierda:**
  - `[☰]` Botón de menú → Abre sidebar de conversaciones (móvil)
  - Logo "PlayGPT EDU"

- **Derecha:**
  - `[📊 Dashboard]` → Ver métricas y progreso
  - `[👤 Perfil]` → Configuración personal
  - `[🚪 Salir]` → Cerrar sesión

#### **2. Sidebar de Conversaciones (Izquierda)**

**Desktop:** Siempre visible
**Mobile:** Se oculta, abrir con botón `[☰]`

**Funciones:**
- **"+ Nueva Conversación"** → Inicia un nuevo chat desde cero
- **Lista de conversaciones anteriores:**
  - Título de la conversación
  - Número de mensajes
  - Fecha ("hace 2 horas", "hace 3 días")
  - Click para cargar la conversación
  - **Hover:** Aparece botón `[🗑️]` para eliminar

**Navegación con teclado:**
- `Tab` para navegar entre conversaciones
- `Enter` para seleccionar
- `Escape` para cerrar el sidebar (móvil)

#### **3. Área de Chat (Centro)**

**Mensaje de Bienvenida:**
```
🤖 ¡Hola! Soy tu tutor de juego responsable con IA.

Puedo ayudarte a:
• Entender conceptos de probabilidad y valor esperado
• Aprender sobre sesgos cognitivos en el juego
• Desarrollar estrategias de gestión de bankroll
• Responder tus preguntas sobre juego responsable

¿Sobre qué te gustaría aprender hoy?
```

**Flujo de conversación:**

1. **Tú escribes:** "¿Qué es la falacia del jugador?"
2. **IA busca:**
   - Sistema busca en la base de conocimiento (RAG)
   - Encuentra documentos relevantes
   - Genera respuesta personalizada
3. **IA responde:**
   - Explicación clara del concepto
   - Ejemplos prácticos
   - Sugerencias de qué aprender después

**Funcionalidades avanzadas:**
- ✅ **Persistencia:** Todas las conversaciones se guardan automáticamente
- ✅ **Contexto:** La IA recuerda toda la conversación
- ✅ **RAG (Retrieval Augmented Generation):**
  - La IA busca en documentos educativos antes de responder
  - Respuestas basadas en contenido verificado
- ✅ **Markdown:** Respuestas con formato (negritas, listas, código)

**Input de texto:**
- Placeholder: "Escribe tu pregunta sobre juego responsable..."
- `Enter` para enviar (o click en botón de enviar)
- Mientras la IA responde: Loader animado

---

## 📊 PASO 4: Dashboard de Progreso

### **URL:** `http://localhost:3001/dashboard`

### **¿Cómo llegar?**
- Click en `[📊 Dashboard]` en el header del chat

### **¿Qué ves?**

#### **1. Header del Dashboard**
- Botón `[← Volver al chat]`
- Título: "Dashboard de Progreso"
- Descripción: "Monitorea tu avance y dominio de conceptos"

#### **2. Cards de Métricas** (Grid 3 columnas)

**📚 Componentes de Conocimiento**
```
┌─────────────────────────┐
│ 📚                      │
│ Componentes de          │
│ Conocimiento            │
│                         │
│        12               │
│    (número grande)      │
│                         │
│ Temas dominados         │
└─────────────────────────┘
```

**📝 Quizzes Completados**
```
┌─────────────────────────┐
│ 📝                      │
│ Quizzes                 │
│ Completados             │
│                         │
│         8               │
│    (número grande)      │
│                         │
│ Evaluaciones realizadas │
└─────────────────────────┘
```

**⭐ Nivel de Mastery Promedio**
```
┌─────────────────────────┐
│ ⭐                      │
│ Nivel de Mastery        │
│ Promedio                │
│                         │
│        76%              │
│    (porcentaje)         │
│                         │
│ Basado en tus quizzes   │
└─────────────────────────┘
```

#### **3. Gráfico de Mastery por Componente**

Barra de progreso para cada componente de conocimiento:

```
Valor Esperado                [████████░░] 85%
Probabilidad Básica           [██████░░░░] 60%
Sesgos Cognitivos            [███████░░░] 72%
Gestión de Bankroll          [█████░░░░░] 50%
Kelly Criterion              [████░░░░░░] 40%
```

**Colores:**
- Verde: >70% (Dominado)
- Amarillo: 40-70% (En progreso)
- Rojo: <40% (Necesita práctica)

#### **4. Historial de Quizzes**

Tabla con tus últimas evaluaciones:

```
┌─────────────────┬─────────────────┬───────┬──────────────┐
│ Tema            │ Bloom's Level   │ Score │ Fecha        │
├─────────────────┼─────────────────┼───────┼──────────────┤
│ Valor Esperado  │ Aplicar         │ 85%   │ Hace 2 días  │
│ Probabilidad    │ Comprender      │ 90%   │ Hace 5 días  │
│ Kelly Criterion │ Analizar        │ 75%   │ Hace 1 sem   │
└─────────────────┴─────────────────┴───────┴──────────────┘
```

**Bloom's Levels:**
- 🧠 **Recordar:** Memoria básica
- 💡 **Comprender:** Explicar conceptos
- 🔧 **Aplicar:** Usar en situaciones prácticas
- 🔍 **Analizar:** Desglosar y comparar
- ⚙️ **Evaluar:** Juzgar y criticar
- 🎨 **Crear:** Diseñar soluciones nuevas

---

## 👤 PASO 5: Perfil Personal

### **URL:** `http://localhost:3001/profile`

### **¿Cómo llegar?**
- Click en `[👤 Perfil]` en el header del chat

### **¿Qué ves?**

#### **1. Header del Perfil**
- Botón `[← Volver al chat]`
- Icono de usuario grande
- Email del usuario

#### **2. Cards de Información**

**👤 Información Personal**
```
┌─────────────────────────────────┐
│ 👤 Información Personal         │
├─────────────────────────────────┤
│ Email: juan@email.com           │
│ Miembro desde: 22 Ene 2025      │
└─────────────────────────────────┘
```

**📚 Progreso Académico**
```
┌─────────────────────────────────┐
│ 📚 Progreso Académico           │
├─────────────────────────────────┤
│ Nivel: Principiante             │
│ Estilo: Visual                  │
│ Módulo actual: Fundamentos      │
└─────────────────────────────────┘
```

**🎯 Estadísticas**
```
┌─────────────────────────────────┐
│ 🎯 Estadísticas de Aprendizaje  │
├─────────────────────────────────┤
│ • 12 componentes dominados      │
│ • 8 quizzes completados         │
│ • 76% mastery promedio          │
└─────────────────────────────────┘
```

**💪 Fortalezas**
```
┌─────────────────────────────────┐
│ 💪 Fortalezas                   │
├─────────────────────────────────┤
│ ✓ Valor Esperado (85%)          │
│ ✓ Sesgos Cognitivos (72%)       │
└─────────────────────────────────┘
```

**📈 Áreas de Mejora**
```
┌─────────────────────────────────┐
│ 📈 Áreas de Mejora              │
├─────────────────────────────────┤
│ ⚠ Kelly Criterion (40%)         │
│ ⚠ Gestión de Riesgo (45%)       │
└─────────────────────────────────┘
```

---

## 📝 PASO 6: Quizzes Personalizados

### **URL:** `http://localhost:3001/quizzes`

### **¿Cómo llegar?**
Actualmente no hay botón directo, pero puedes:
- Navegar manualmente a `/quizzes`
- O la IA puede sugerirte hacer un quiz durante la conversación

### **Página de Generación de Quiz**

#### **1. Formulario de Generación**

```
┌──────────────────────────────────────┐
│ 📝 Generar Quiz Personalizado       │
├──────────────────────────────────────┤
│ 📚 Tema:                             │
│ [Valor Esperado          ▼]          │
│                                      │
│ 🎯 Nivel de Bloom:                   │
│ [Aplicar                 ▼]          │
│                                      │
│ [🎲 Generar Quiz]                    │
└──────────────────────────────────────┘
```

**Opciones de Tema:**
- Valor Esperado
- Probabilidad Básica
- Sesgos Cognitivos
- Gestión de Bankroll
- Kelly Criterion
- Hot Hand Fallacy
- Gambler's Fallacy

**Opciones de Bloom's Level:**
- Recordar (más fácil)
- Comprender
- Aplicar (recomendado)
- Analizar
- Evaluar
- Crear (más difícil)

#### **2. Generación del Quiz**

Al hacer click en "Generar Quiz":
1. Toast: "Generando quiz personalizado..."
2. La IA genera 5 preguntas basadas en:
   - Tu perfil de estudiante
   - Tu historial de mastery
   - El tema y nivel seleccionado
3. Redirección a `/quizzes/[id]`

---

### **Página del Quiz**

### **URL:** `http://localhost:3001/quizzes/[id]`

#### **Layout del Quiz:**

```
┌─────────────────────────────────────────┐
│ [← Volver a quizzes]                    │
│                                         │
│ 📝 Quiz: Valor Esperado                │
│ Nivel: Aplicar                          │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Pregunta 1 de 5                     │ │
│ │                                     │ │
│ │ ¿Cuál es el valor esperado de...?  │ │
│ │                                     │ │
│ │ ○ Opción A: 2.5                    │ │
│ │ ○ Opción B: 3.0                    │ │
│ │ ○ Opción C: 1.8                    │ │
│ │ ○ Opción D: 4.2                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Pregunta anterior] [Siguiente pregunta]│
│                                         │
│ [Enviar Quiz]                           │
└─────────────────────────────────────────┘
```

#### **Flujo del Quiz:**

1. **Responder preguntas:**
   - Click en una opción para seleccionarla
   - Navegación con botones "Anterior" / "Siguiente"
   - No puedes enviar hasta responder todas

2. **Enviar el quiz:**
   - Click en "Enviar Quiz"
   - Toast: "Evaluando tus respuestas..."
   - Sistema evalúa cada respuesta
   - Calcula score total

3. **Ver resultados:**
   - Toast: "¡Quiz completado! Obtuviste 85%"
   - Cada pregunta muestra:
     - ✅ Verde si correcta
     - ❌ Rojo si incorrecta
     - Explicación de la respuesta correcta
     - Retroalimentación personalizada

4. **Actualización del perfil:**
   - El sistema actualiza tu mastery para ese componente
   - Las fortalezas/debilidades se recalculan
   - Dashboard se actualiza automáticamente

---

## 🔄 FLUJO COMPLETO DEL USUARIO

### **Ciclo de Aprendizaje:**

```
1. Landing Page
   ↓
2. Crear cuenta / Login
   ↓
3. Chat con IA
   ├→ Hacer preguntas
   ├→ Aprender conceptos
   └→ IA sugiere quiz
      ↓
4. Generar Quiz
   ↓
5. Responder Quiz
   ↓
6. Ver Resultados
   ↓
7. Dashboard actualizado
   ├→ Ver progreso
   ├→ Identificar debilidades
   └→ Volver al chat para aprender más
      ↓
   (Repetir ciclo)
```

---

## 🎨 CARACTERÍSTICAS DE ACCESIBILIDAD

### **Para usuarios con discapacidades:**

✅ **Navegación por teclado:**
- `Tab` / `Shift+Tab` para navegar
- `Enter` / `Space` para activar botones
- `Escape` para cerrar modales/sidebars

✅ **Screen readers:**
- Todos los botones tienen `aria-label`
- Roles ARIA correctos (`role="button"`, etc.)
- Landmarks semánticos (`<nav>`, `<main>`, etc.)

✅ **Contraste de colores:**
- WCAG AA compliant en todos los textos
- Ratios de contraste:
  - Títulos: 21:1 (AAA)
  - Texto normal: 11:1 (AAA)
  - Texto secundario: 7:1 (AA)

✅ **Focus states:**
- Anillo azul brillante en elementos con foco
- Visible solo en navegación por teclado
- No aparece al hacer click con mouse

---

## 📱 RESPONSIVE DESIGN

### **Desktop (>1024px):**
- Sidebar siempre visible
- 3 columnas en dashboard
- Grid 2 columnas en modules

### **Tablet (768px - 1024px):**
- Sidebar siempre visible
- 2 columnas en dashboard
- Grid 2 columnas en modules

### **Mobile (<768px):**
- Sidebar oculto (abrir con botón ☰)
- 1-2 columnas en dashboard
- Grid 2 columnas en stats
- Stack vertical en forms

---

## 💡 TIPS Y MEJORES PRÁCTICAS

### **Para aprovechar al máximo PlayGPT EDU:**

1. **Sé específico en tus preguntas:**
   - ❌ "háblame de probabilidad"
   - ✅ "¿cómo calculo el valor esperado en una apuesta deportiva?"

2. **Haz quizzes regularmente:**
   - Recomendación: 1 quiz después de cada sesión de chat
   - Ayuda a consolidar el aprendizaje

3. **Revisa tu dashboard:**
   - Identifica tus debilidades
   - Enfócate en áreas con <70% mastery

4. **Usa conversaciones múltiples:**
   - Una conversación por tema
   - Más fácil de revisar después

5. **Pide ejemplos:**
   - La IA puede dar ejemplos prácticos
   - Intenta: "dame un ejemplo de la falacia del jugador en deportes"

---

## ❓ PREGUNTAS FRECUENTES

### **¿Se guardan mis conversaciones?**
Sí, todas las conversaciones se guardan automáticamente en tu cuenta.

### **¿Puedo eliminar conversaciones?**
Sí, hover sobre una conversación en el sidebar y click en el icono de basura.

### **¿Cuántas preguntas puedo hacer?**
Sin límite. Pregunta todo lo que necesites aprender.

### **¿La IA tiene acceso a internet?**
No, solo busca en la base de conocimiento curada de PlayGPT EDU.

### **¿Puedo cambiar mi nivel de principiante?**
El sistema lo actualiza automáticamente basado en tus quizzes.

### **¿Cómo se calcula el mastery?**
Basado en:
- Scores de quizzes
- Número de intentos
- Tiempo desde última práctica
- Algoritmo BKT (Bayesian Knowledge Tracing)

---

## 🔒 PRIVACIDAD Y SEGURIDAD

### **Tus datos están seguros:**

✅ **Autenticación segura:**
- Passwords hasheadas (bcrypt)
- Tokens JWT con httpOnly cookies
- Session expiration automática

✅ **Row Level Security:**
- Solo ves tus propios datos
- No puedes acceder a datos de otros usuarios
- Políticas a nivel de base de datos

✅ **No compartimos datos:**
- Tu información es privada
- No vendemos datos a terceros
- Uso exclusivo para mejorar tu aprendizaje

---

## 🆘 SOPORTE

### **¿Necesitas ayuda?**

Para reportar bugs o problemas:
- GitHub Issues: https://github.com/[repo]/issues

---

**¡Disfruta aprendiendo sobre juego responsable con IA! 🎓✨**

---

**Versión:** 2.0
**Última actualización:** 2025-01-22
**Equipo:** PlayGPT EDU

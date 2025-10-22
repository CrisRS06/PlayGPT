# 🚀 Guía Rápida: Probar PlayGPT EDU Localmente

## ✅ Estado Actual: TODO CONFIGURADO

```bash
✅ Variables de entorno: Configuradas
✅ Base de datos: Conectada (7 tablas)
✅ pgvector: Habilitado
✅ Embeddings: 52 documentos cargados
✅ Dependencias: Instaladas
```

---

## 🏃 Inicio Rápido (1 minuto)

### 1. Iniciar el servidor de desarrollo

```bash
cd /Users/christianramirez/Programas/Consultoria\ CyA/PlayGPT/PlayGPT\ EDU/playgpt-edu

# Opción 1: Usando pnpm
pnpm dev

# Opción 2: Si ya está corriendo en otro puerto
pnpm dev --port 3002
```

### 2. Abrir en el navegador

```
http://localhost:3000
```

Si el puerto 3000 está ocupado, verás algo como:
```
⚠ Port 3000 is in use, using available port 3001 instead
Local: http://localhost:3001
```

---

## 🧪 Flujos de Prueba

### 📝 **Prueba 1: Registro y Login (2 min)**

1. Ve a `http://localhost:3000`
2. Haz clic en "Comenzar Ahora"
3. Regístrate con un email:
   ```
   Email: test@example.com
   Password: Test123456!
   ```
4. Verifica que te redirija a `/chat`

### 💬 **Prueba 2: Chat con IA + RAG (3 min)**

1. En la página de chat, escribe:
   ```
   "¿Qué es el valor esperado?"
   ```
2. Verifica que:
   - ✅ La respuesta es relevante
   - ✅ Usa información de los documentos cargados
   - ✅ El streaming funciona correctamente
   - ✅ Se guarda en historial

3. Prueba el **historial**:
   - Haz clic en el ícono de conversaciones (izquierda)
   - Verifica que aparece tu conversación
   - Carga una conversación anterior

4. Prueba **nueva conversación**:
   - Botón "Nueva Conversación"
   - Verifica que limpia el chat

### 📊 **Prueba 3: Generación de Quizzes (5 min)**

1. Ve a `/quizzes` o haz clic en "Tomar un Quiz" en el chat

2. Genera un quiz:
   ```
   Tema: Valor Esperado
   Nivel: Principiante
   Preguntas: 5
   ```

3. Verifica que:
   - ✅ Se genera el quiz (puede tardar 10-15 segundos)
   - ✅ Te redirige a `/quizzes/[id]`
   - ✅ Muestra 5 preguntas con 4 opciones cada una

4. Completa el quiz:
   - Responde las 5 preguntas
   - Haz clic en "Enviar Quiz"
   - Verifica:
     - ✅ Muestra tu puntaje
     - ✅ Muestra respuestas correctas/incorrectas
     - ✅ Muestra explicaciones

### 👤 **Prueba 4: Perfil de Estudiante (2 min)**

1. Ve a `/profile`

2. Verifica que muestra:
   - ✅ Nombre y email del usuario
   - ✅ Nivel (Principiante/Intermedio/Avanzado)
   - ✅ Estilo de aprendizaje
   - ✅ Estadísticas generales:
     - Interacciones totales
     - Conceptos dominados
     - Promedio de quizzes
     - Quizzes completados

3. Revisa **Dominio de Conceptos**:
   - Debería mostrar los conceptos que practicaste
   - Con barras de progreso
   - Niveles de mastery (0-100%)

4. Revisa **Quizzes Recientes**:
   - Debería mostrar los quizzes que completaste
   - Con fecha y puntaje

### 📈 **Prueba 5: Dashboard (2 min)**

1. Ve a `/dashboard`

2. Verifica las tarjetas de estadísticas:
   - ✅ Quizzes Completados
   - ✅ Promedio de Calificación
   - ✅ Conceptos Dominados
   - ✅ Total Interacciones

3. Revisa el **gráfico de progreso**:
   - Debería mostrar los últimos 5 quizzes
   - Con barras de colores según el puntaje

4. Revisa **Dominio de Conceptos**:
   - Barra de dominio general
   - Top 5 conceptos con progreso

---

## 🔍 Verificaciones Técnicas

### Rate Limiting (HTTP 429)

Prueba los límites:

```bash
# Chat: 20 requests/minuto
for i in {1..25}; do curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"test"}]}' -w "\n"; done

# Deberías ver HTTP 429 después de la request #21
```

### Headers de Rate Limit

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}' \
  -i | grep "X-RateLimit"

# Deberías ver:
# X-RateLimit-Limit: 20
# X-RateLimit-Remaining: 19
# X-RateLimit-Reset: 2025-10-22T...
```

### Base de Datos

Verifica que los datos se guardan:

```bash
# Verifica base de datos
pnpm verify:db

# Verifica embeddings
pnpm tsx scripts/verify-embeddings.ts

# Prueba búsqueda RAG
pnpm test:search
```

---

## 🐛 Troubleshooting

### Error: "Port 3000 already in use"

```bash
# Encuentra el proceso usando el puerto
lsof -ti:3000 | xargs kill -9

# O usa otro puerto
pnpm dev --port 3002
```

### Error: "Supabase connection failed"

```bash
# Verifica variables de entorno
pnpm verify:env

# Verifica conexión
pnpm verify:db
```

### Error: "OpenAI API key not configured"

```bash
# Verifica que esté en .env.local
cat .env.local | grep OPENAI

# Debe comenzar con sk-proj- o sk-
```

### Chat no responde / No encuentra contexto

```bash
# Verifica embeddings
pnpm tsx scripts/verify-embeddings.ts

# Si no hay documentos, cárgalos:
pnpm ingest
```

### Rate limit demasiado restrictivo

Edita `src/lib/rate-limit.ts`:

```typescript
// Aumentar límites para desarrollo local
export const chatRateLimiter = new RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 100, // Era 20
})
```

---

## 📊 Monitoreo en Tiempo Real

### Logs del servidor

El servidor mostrará logs útiles:

```bash
🔍 Searching knowledge base for: ¿Qué es el valor esperado?
📚 Found 5 relevant documents
📝 Generating quiz on "Valor Esperado" for user abc-123
✅ Quiz generated successfully with ID: xyz-789
✅ Quiz attempt saved: def-456 - Score: 80%
📊 Knowledge components updated for user abc-123
```

### Consola del navegador

Abre DevTools (F12) para ver:
- Network requests
- Errores de JavaScript
- Estados de React

---

## 🔐 Cuentas de Prueba

Para testing rápido, usa estos usuarios:

```bash
# Usuario 1
Email: student1@test.com
Password: Test123456!

# Usuario 2
Email: student2@test.com
Password: Test123456!
```

Si no existen, créalos durante el registro.

---

## 🎯 Escenarios Completos de Prueba

### Escenario A: Estudiante Nuevo

1. Registrarse
2. Chat: "Explícame qué es la probabilidad básica"
3. Tomar quiz de Probabilidad Básica
4. Ver perfil (debería mostrar 1 concepto)
5. Ver dashboard (1 quiz completado)

### Escenario B: Múltiples Sesiones

1. Hacer 3 conversaciones diferentes
2. Tomar 3 quizzes en temas distintos
3. Ver historial de conversaciones
4. Ver dashboard (progreso de 3 quizzes)
5. Ver perfil (múltiples conceptos)

### Escenario C: Progreso en un Tema

1. Tomar quiz de "Valor Esperado" (nivel principiante)
2. Ver mastery level en perfil
3. Chatear sobre "Valor Esperado"
4. Tomar otro quiz de "Valor Esperado" (nivel intermedio)
5. Verificar que mastery level aumenta

---

## 📱 Testing Responsive

### Desktop
```
1920x1080 - Layout completo
1366x768  - Ajustado
```

### Tablet
```
768x1024 (iPad) - Sidebar colapsado
```

### Mobile
```
375x667 (iPhone SE) - Layout mobile
390x844 (iPhone 12) - Layout mobile optimizado
```

---

## 🚀 Siguiente Paso: Producción

Cuando todo funcione localmente:

```bash
# 1. Verificar todo
pnpm verify:env
pnpm verify:db
pnpm lint
pnpm build

# 2. Deploy
vercel --prod
```

Ver `DEPLOYMENT.md` para instrucciones completas.

---

## 📞 Ayuda Adicional

- **DEPLOYMENT.md**: Guía de deployment
- **PRE_PRODUCTION_CHECKLIST.md**: Checklist completo
- **README.md**: Documentación general

¡Todo listo para probar! 🎉

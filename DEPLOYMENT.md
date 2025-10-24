# 🚀 Guía de Deployment - PlayGPT EDU

## Variables de Entorno Requeridas

### 🔴 CRÍTICAS (El app no funciona sin estas)

#### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aquí
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aquí
```

**Dónde obtenerlas:**
1. Ve a https://app.supabase.com/project/[tu-proyecto]/settings/api
2. Copia "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
3. Copia "anon public" → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copia "service_role" → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **NUNCA expongas esta clave**

#### OpenAI
```bash
OPENAI_API_KEY=sk-proj-...
```

**Dónde obtenerla:**
1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva API key
3. ⚠️ **Configura límites de gasto** en https://platform.openai.com/account/limits

#### App Configuration
```bash
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

**Notas:**
- En desarrollo: `http://localhost:3000`
- En producción: Tu dominio de Vercel

---

## 📋 Checklist de Deployment

### Antes de hacer deploy:

- [ ] **Base de datos configurada**
  - [ ] Ejecutar `supabase-schema.sql` en Supabase SQL Editor
  - [ ] Verificar que pgvector esté habilitado
  - [ ] Verificar RLS policies activas
  - [ ] Cargar documentos iniciales (embeddings)

- [ ] **Variables de entorno**
  - [ ] Todas las variables configuradas en Vercel
  - [ ] Variables verificadas con script: `pnpm verify:env`
  - [ ] URL de producción actualizada

- [ ] **Build y Tests**
  - [ ] Build exitoso: `pnpm build`
  - [ ] ESLint limpio: `pnpm lint`
  - [ ] Tests manuales de flujos críticos

- [ ] **Seguridad**
  - [ ] Rate limiting configurado
  - [ ] CORS configurado correctamente
  - [ ] Service role key NUNCA en código cliente

---

## 🔧 Deployment en Vercel

### Primer Deploy

1. **Conectar repositorio**
   ```bash
   vercel login
   vercel
   ```

2. **Configurar variables de entorno**
   - En el dashboard de Vercel → Settings → Environment Variables
   - Agregar todas las variables mencionadas arriba
   - Asegurarse de seleccionar "Production", "Preview" y "Development" según corresponda

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploys posteriores

Los deploys automáticos se harán con cada push a `main`.

Para deploy manual:
```bash
git push origin main
# o
vercel --prod
```

---

## 🗄️ Setup de Base de Datos

### 1. Crear proyecto en Supabase
- Ve a https://app.supabase.com
- Crea un nuevo proyecto
- Guarda la contraseña de la base de datos

### 2. Ejecutar schema
1. Ve a SQL Editor en Supabase
2. Copia todo el contenido de `supabase-schema.sql`
3. Ejecuta el script
4. Verifica que aparezcan todas las tablas

### 3. Cargar documentos (embeddings)
```bash
# Opción 1: Usar script de ingesta (si existe)
pnpm ingest

# Opción 2: Manualmente en Supabase
# Ir a Table Editor → documents → Insert row
```

### 4. Verificar funciones
```sql
-- En SQL Editor de Supabase
SELECT match_documents(
  ARRAY[0.1, 0.2, ...]::vector(1536),
  0.7,
  5,
  NULL
);
```

---

## ⚠️ Troubleshooting

### Error: "Invalid Supabase URL"
- Verifica que la URL comience con `https://`
- Verifica que no tenga espacios o saltos de línea

### Error: "OpenAI API key not configured"
- Verifica que la key comience con `sk-proj-`
- Verifica que tenga fondos disponibles en OpenAI

### Error: "Row Level Security policy violation"
- Verifica que el usuario esté autenticado
- Verifica que las políticas RLS estén creadas correctamente
- Ejecuta `supabase-schema.sql` completo

### Build fails en Vercel
- Verifica que `pnpm build` funcione localmente
- Revisa los logs de Vercel para ver el error específico
- Verifica que todas las variables de entorno estén configuradas

---

## 📊 Monitoreo Post-Deploy

### Verificaciones inmediatas:
1. [ ] Landing page carga correctamente
2. [ ] Signup/Login funcionan
3. [ ] Chat responde correctamente
4. [ ] Generación de quizzes funciona
5. [ ] Profile y Dashboard muestran datos

### Verificaciones de 24 horas:
1. [ ] Revisar logs de errores en Vercel
2. [ ] Verificar costos de OpenAI
3. [ ] Verificar uso de base de datos en Supabase
4. [ ] Probar en diferentes dispositivos/navegadores

---

## 💰 Gestión de Costos

### OpenAI
- **Modelo usado**: GPT-4o-mini
- **Costo estimado**: ~$0.15-0.30 USD por 1000 tokens de output
- **Recomendación**: Establecer límite mensual en https://platform.openai.com/account/limits

### Supabase
- **Plan Free**: Hasta 500MB de base de datos, 2GB de transferencia/mes
- **Recomendación**: Monitorear uso en dashboard

### Vercel
- **Plan Hobby**: Gratis para proyectos personales
- **Límite**: 100GB de bandwidth/mes

---

## 🔒 Seguridad

### Prácticas implementadas:
✅ Row Level Security (RLS) en todas las tablas
✅ Autenticación requerida para rutas protegidas
✅ Service role key solo en backend
✅ Rate limiting en APIs críticas

### Recomendaciones adicionales:
- [ ] Habilitar 2FA en Supabase
- [ ] Rotar API keys cada 3-6 meses
- [ ] Configurar alertas de costos en OpenAI
- [ ] Revisar logs regularmente

---

## 📝 Notas Adicionales

- **Next.js 16 Proxy**: Migrado correctamente de `middleware.ts` a `proxy.ts` (actualizado 2025-10-22)
- **Embeddings**: Los documentos deben tener embeddings pre-generados antes del primer uso del chat
- **RLS**: Si agregas nuevas tablas, siempre habilita RLS y crea políticas apropiadas

# Guía de Deployment - PlayGPT

Esta guía te ayudará a desplegar PlayGPT en producción paso a paso.

## Índice

1. [Pre-requisitos](#pre-requisitos)
2. [Configuración de Botpress](#configuración-de-botpress)
3. [Deployment en Vercel](#deployment-en-vercel)
4. [Configuración de Dominio](#configuración-de-dominio)
5. [Variables de Entorno en Producción](#variables-de-entorno-en-producción)
6. [Verificación Post-Deployment](#verificación-post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Pre-requisitos

Antes de comenzar, asegúrate de tener:

- [ ] Bot configurado y publicado en Botpress Cloud
- [ ] Cuenta en Vercel (gratis en [vercel.com](https://vercel.com))
- [ ] Código en un repositorio Git (GitHub, GitLab, o Bitbucket)
- [ ] Dominio comprado (opcional, pero recomendado)

---

## Configuración de Botpress

### 1. Verifica que tu bot esté publicado

1. Ve a [Botpress Cloud](https://botpress.com/admin)
2. Selecciona tu bot
3. Click en **Publish** (botón superior derecho)
4. Espera a que el deployment termine

### 2. Obtén tu Client ID

1. En tu bot, ve a **Integrations**
2. Busca **Webchat** en la lista
3. Click en **Configure**
4. Copia el **Client ID** (lo necesitarás en el siguiente paso)

**Importante**: Guarda este Client ID en un lugar seguro.

---

## Deployment en Vercel

### Opción A: Deploy desde la interfaz web (Recomendado para principiantes)

#### Paso 1: Conecta tu repositorio

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Haz login con tu cuenta de GitHub/GitLab/Bitbucket
3. Selecciona tu repositorio de PlayGPT
4. Click en **Import**

#### Paso 2: Configura el proyecto

Vercel detectará automáticamente que es un proyecto Next.js.

**Build Settings:**
- Framework Preset: `Next.js`
- Build Command: `next build` (dejar por defecto)
- Output Directory: `.next` (dejar por defecto)
- Install Command: `npm install` (dejar por defecto)

#### Paso 3: Agrega variables de entorno

En la sección **Environment Variables**, agrega:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_BOTPRESS_CLIENT_ID` | Tu Client ID de Botpress |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-dominio.vercel.app` |
| `NEXT_PUBLIC_SITE_NAME` | `PlayGPT` |

**Importante**: Aplica las variables a todos los entornos (Production, Preview, Development)

#### Paso 4: Deploy

1. Click en **Deploy**
2. Espera 2-3 minutos mientras Vercel construye tu aplicación
3. Una vez completado, obtendrás una URL como `https://playgpt.vercel.app`

### Opción B: Deploy desde CLI (Para usuarios avanzados)

```bash
# 1. Instala Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Configura el proyecto (primera vez)
vercel

# 4. Agrega variables de entorno
vercel env add NEXT_PUBLIC_BOTPRESS_CLIENT_ID production
# Pega tu Client ID cuando te lo pida

vercel env add NEXT_PUBLIC_SITE_URL production
# Ingresa tu URL (ej: https://playgpt.ai)

# 5. Deploy a producción
vercel --prod
```

---

## Configuración de Dominio

### Paso 1: Compra un dominio

Recomendamos:
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)
- [Google Domains](https://domains.google/)
- [Cloudflare](https://www.cloudflare.com/products/registrar/)

**Sugerencias de dominios**:
- `playgpt.ai`
- `playgpt.com`
- `playgpt.io`

### Paso 2: Conecta el dominio a Vercel

#### En Vercel:

1. Ve a tu proyecto en Vercel
2. Click en **Settings** → **Domains**
3. Click en **Add Domain**
4. Ingresa tu dominio (ej: `playgpt.ai`)
5. Vercel te dará instrucciones específicas para configurar DNS

#### Configuración DNS (Ejemplo para dominios comunes):

Si tu dominio está en **Namecheap**, **GoDaddy**, etc.:

1. Ve al panel de control de tu proveedor de dominio
2. Busca la sección de **DNS Management** o **Nameservers**
3. Agrega los siguientes records:

**Opción 1: Records A y CNAME** (Recomendado)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.19.19` | Automático |
| CNAME | www | `cname.vercel-dns.com` | Automático |

**Opción 2: Nameservers de Vercel**

Si prefieres usar los nameservers de Vercel:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Paso 3: Espera la propagación DNS

- La propagación DNS puede tomar entre 10 minutos y 48 horas
- Normalmente toma ~1 hora
- Vercel configurará SSL (HTTPS) automáticamente

### Paso 4: Actualiza la variable de entorno

Una vez que tu dominio esté activo:

1. Ve a **Settings** → **Environment Variables** en Vercel
2. Edita `NEXT_PUBLIC_SITE_URL`
3. Cambia de `https://playgpt.vercel.app` a `https://tu-dominio.com`
4. Click en **Save**
5. Redeploy tu proyecto (ve a **Deployments** → **...** → **Redeploy**)

---

## Variables de Entorno en Producción

Asegúrate de tener configuradas todas estas variables en Vercel:

### Variables obligatorias:

```bash
NEXT_PUBLIC_BOTPRESS_CLIENT_ID=tu_client_id_de_botpress
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_SITE_NAME=PlayGPT
NEXT_PUBLIC_BOTPRESS_HOST_URL=https://cdn.botpress.cloud/webchat/v2
```

### Variables opcionales (para futuro):

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx

# Auth (cuando implementes login)
NEXTAUTH_URL=https://tu-dominio.com
NEXTAUTH_SECRET=genera_un_secret_seguro_aqui
```

### Cómo generar NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

---

## Verificación Post-Deployment

### Checklist de verificación:

- [ ] La landing page carga correctamente
- [ ] El botón "Habla con el Bot" funciona
- [ ] La página `/chat` carga el chat de Botpress
- [ ] Puedes enviar mensajes y recibir respuestas
- [ ] El sitio tiene HTTPS (candado verde en el navegador)
- [ ] El dominio custom funciona (si lo configuraste)
- [ ] Open Graph tags funcionan (prueba compartiendo en redes sociales)

### Herramientas de testing:

1. **SSL Check**: https://www.ssllabs.com/ssltest/
2. **Open Graph Check**: https://www.opengraph.xyz/
3. **Lighthouse**: Audita en Chrome DevTools
4. **PageSpeed Insights**: https://pagespeed.web.dev/

---

## Troubleshooting

### El chat no se carga

**Problema**: Ves un error o pantalla de carga infinita

**Solución**:
1. Verifica que `NEXT_PUBLIC_BOTPRESS_CLIENT_ID` esté configurado correctamente
2. Asegúrate que tu bot esté publicado en Botpress Cloud
3. Revisa la consola del navegador (F12) para ver errores específicos
4. Verifica que la URL del script de Botpress sea correcta

### Error "Client ID is not defined"

**Problema**: El chat muestra este mensaje de error

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que `NEXT_PUBLIC_BOTPRESS_CLIENT_ID` exista
3. Asegúrate que está aplicada al environment "Production"
4. Redeploy el proyecto

### El dominio custom no funciona

**Problema**: El dominio muestra error 404 o "This site can't be reached"

**Solución**:
1. Verifica la configuración DNS con `dig tu-dominio.com`
2. Espera más tiempo (puede tomar hasta 48h)
3. Verifica que los records DNS sean correctos
4. Contacta soporte de tu proveedor de dominio

### Build falla en Vercel

**Problema**: El deployment falla con errores de TypeScript o build

**Solución**:
1. Ejecuta `npm run build` localmente para ver el error completo
2. Verifica que todas las dependencias estén en `package.json`
3. Asegúrate de usar Node.js 18.17+
4. Revisa los logs de Vercel para errores específicos

### Variables de entorno no se aplican

**Problema**: Los cambios en variables de entorno no se reflejan

**Solución**:
1. Después de cambiar variables, siempre redeploy
2. Las variables solo se aplican en builds, no en runtime
3. Verifica que usas `NEXT_PUBLIC_` para variables del cliente

---

## Mejores Prácticas

### Seguridad

- ✅ Nunca commitees archivos `.env.local`
- ✅ Usa variables de entorno para todos los secrets
- ✅ Configura CORS si usas API routes
- ✅ Implementa rate limiting en producción
- ✅ Mantén las dependencias actualizadas

### Performance

- ✅ Usa el Image component de Next.js para imágenes
- ✅ Implementa lazy loading para componentes pesados
- ✅ Configura caching apropiado
- ✅ Monitorea Web Vitals con Vercel Analytics

### Monitoring

- ✅ Configura Vercel Analytics
- ✅ Implementa error tracking (Sentry)
- ✅ Configura uptime monitoring
- ✅ Revisa logs regularmente

---

## Próximos Pasos

Una vez que tu sitio esté en producción:

1. [ ] Configura Google Analytics
2. [ ] Implementa Sentry para error tracking
3. [ ] Agrega un sitemap.xml
4. [ ] Configura Google Search Console
5. [ ] Implementa un blog o sección de recursos
6. [ ] Agrega autenticación de usuarios
7. [ ] Implementa sistema de feedback

---

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Botpress](https://botpress.com/docs)
- [Guía de SEO para Next.js](https://nextjs.org/learn/seo/introduction-to-seo)

---

Si tienes problemas o preguntas, abre un issue en el repositorio o contacta al equipo de desarrollo.

# Quick Start - PlayGPT

Guía ultra-rápida para tener PlayGPT corriendo en 5 minutos.

## Paso 1: Clona e Instala

```bash
git clone https://github.com/tu-usuario/playgpt.git
cd playgpt
npm install
```

## Paso 2: Configura Botpress

1. Ve a [botpress.com/admin](https://botpress.com/admin)
2. Selecciona tu bot → **Integrations** → **Webchat**
3. Copia el **Client ID**

## Paso 3: Variables de Entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```bash
NEXT_PUBLIC_BOTPRESS_CLIENT_ID=pega_tu_client_id_aqui
```

## Paso 4: Ejecuta

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Paso 5: Verifica

- ✅ Landing page carga
- ✅ Click en "Habla con el Bot"
- ✅ Chat se abre
- ✅ Puedes enviar mensajes

---

## Deploy a Vercel (2 minutos)

1. Push a GitHub
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa tu repo
4. Agrega `NEXT_PUBLIC_BOTPRESS_CLIENT_ID` en Environment Variables
5. Click Deploy

¡Listo! 🎉

---

## Próximos Pasos

- 📖 Lee el [README.md](README.md) completo
- 🚀 Revisa [DEPLOYMENT.md](DEPLOYMENT.md) para producción
- 🎨 Personaliza colores en `src/app/globals.css`
- 🤖 Customiza el bot en `src/config/botpress.ts`

---

## Troubleshooting Rápido

**Chat no carga:**
- Verifica que el Client ID esté correcto
- Asegúrate que el bot esté publicado en Botpress

**Build error:**
- Ejecuta `rm -rf .next && npm install`
- Verifica que estés usando Node 18.17+

**Más ayuda:** Abre un issue o lee la [Guía de Contribución](CONTRIBUTING.md)

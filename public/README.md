# Assets Públicos - PlayGPT

Esta carpeta contiene los assets estáticos del proyecto.

## Assets Requeridos

Para completar el branding del sitio, necesitas agregar los siguientes archivos:

### Favicons y App Icons

- `favicon.ico` (16x16, 32x32, 48x48 ICO file)
- `favicon-16x16.png` (16x16 PNG)
- `favicon-32x32.png` (32x32 PNG)
- `apple-touch-icon.png` (180x180 PNG)
- `android-chrome-192x192.png` (192x192 PNG)
- `android-chrome-512x512.png` (512x512 PNG)

### Open Graph & Social

- `og-image.png` (1200x630 PNG) - Para compartir en redes sociales
- `twitter-image.png` (1200x600 PNG) - Opcional, específico para Twitter

### Logo y Branding

- `logo.svg` - Logo principal del sitio
- `logo.png` - Versión PNG del logo (para compatibilidad)
- `bot-avatar.png` - Avatar del bot en el chat (recomendado: 64x64 o 128x128)

## Herramientas Recomendadas

### Para crear Favicons:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

### Para crear Open Graph images:
- [Canva](https://www.canva.com/)
- [Figma](https://www.figma.com/)
- [OG Image Playground](https://og-playground.vercel.app/)

### Para optimizar imágenes:
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)

## Especificaciones de Diseño

### Colores del Brand (sugeridos):
- **Primary**: `#10B981` (Verde)
- **Secondary**: `#3B82F6` (Azul)
- **Accent**: `#FCD34D` (Amarillo)

### Tipografía:
- **Font Family**: Inter (ya configurado en el proyecto)

### Estilo:
- Limpio y profesional
- Transmite confianza y responsabilidad
- Amigable pero serio
- Colores que reflejan salud y bienestar

## Ejemplos de Uso

```tsx
// Usar logo en componentes
import Image from 'next/image';

<Image
  src="/logo.svg"
  alt="PlayGPT"
  width={120}
  height={40}
/>

// Usar avatar del bot
<Image
  src="/bot-avatar.png"
  alt="PlayGPT Bot"
  width={64}
  height={64}
  className="rounded-full"
/>
```

## Checklist

- [ ] favicon.ico
- [ ] favicon-16x16.png
- [ ] favicon-32x32.png
- [ ] apple-touch-icon.png
- [ ] android-chrome-192x192.png
- [ ] android-chrome-512x512.png
- [ ] og-image.png
- [ ] logo.svg
- [ ] logo.png
- [ ] bot-avatar.png

Una vez agregues estos archivos, elimina este README.md

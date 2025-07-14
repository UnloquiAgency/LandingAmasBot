# Guía de Deployment con Dominio Personalizado

## 1. Configuración del Webhook en la Landing

### Webhook de n8n
En tu landing page, configura el webhook que conecta con tu backend:

```javascript
// src/pages/Index.tsx
const webhookUrl = 'https://tudominio.app.n8n.cloud/webhook/chat-register';

// Ejemplo de llamada al webhook
const res = await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: sessionId,
    chatInput: userMessage
  })
});
```

**Importante**: Cambia todas las ocurrencias del webhook en tu código antes del deployment.

## 2. Preparación para GitHub Pages

### 2.1 Crear archivo CNAME
```bash
# En la carpeta public/
echo "landing.tudominio.com" > public/CNAME
```

### 2.2 Configurar Vite
```javascript
// vite.config.ts
export default defineConfig({
  base: '/', // Importante para dominio personalizado
  // ... resto de configuración
});
```

### 2.3 Crear GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

## 3. Configuración en GitHub

### 3.1 Hacer el repositorio público
1. Settings → General → Danger Zone
2. Change visibility → Make public
3. Confirmar escribiendo el nombre del repo

### 3.2 Habilitar GitHub Pages
1. Settings → Pages
2. Source: **GitHub Actions**
3. El workflow se ejecutará automáticamente

## 4. Configuración DNS en Hostinger

### 4.1 Acceder al panel DNS
1. Panel de Hostinger → Dominios
2. Seleccionar tu dominio → DNS/Nameservers

### 4.2 Crear registro CNAME
```
Tipo: CNAME
Nombre: landing
Contenido: tunombredeusuario.github.io
TTL: 300
```

**Nota**: Si ya tienes un CNAME para el subdominio (ej: de Netlify), solo edítalo.

### 4.3 Tiempo de propagación
- Los cambios DNS tardan 15-60 minutos
- GitHub generará automáticamente el certificado SSL

## 5. Verificación

### 5.1 En GitHub
- Actions: Verificar que el workflow termine exitosamente
- Settings → Pages: Debe mostrar "DNS check successful"

### 5.2 Acceso al sitio
Tu landing estará disponible en: `https://landing.tudominio.com`

## Tips Importantes

1. **Webhook seguro**: Aunque el webhook esté visible en el código público, debe estar protegido en el servidor (n8n)

2. **Variables de entorno**: Para proyectos con información sensible, usa GitHub Secrets

3. **Actualizaciones**: Cada push a `main` actualizará automáticamente la landing

4. **Múltiples landings**: Puedes repetir este proceso para diferentes subdominios:
   - `app.tudominio.com`
   - `beta.tudominio.com`
   - `promo.tudominio.com`

## Resumen del flujo

1. Configurar webhook en el código → 2. Preparar archivos de deployment → 3. Push a GitHub → 4. Hacer repo público → 5. Activar GitHub Pages → 6. Configurar DNS en Hostinger → 7. ¡Listo!

Total de tiempo: ~30 minutos (incluyendo propagación DNS)
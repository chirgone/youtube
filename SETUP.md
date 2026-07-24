# JOVI Academy - Setup Completo

Guía para configurar ambas máquinas (M1: Video Upload, M2: Script Generator).

## 📋 Requisitos Previos

### Cuentas & APIs
- ✅ **Groq API** (free): https://console.groq.com → `GROQ_API_KEY`
- ✅ **OpenAI API**: https://platform.openai.com/api-keys → `OPENAI_API_KEY`
- ✅ **Pexels API** (free): https://www.pexels.com/api → `PEXELS_API_KEY`
- ✅ **Shotstack API**: https://www.shotstack.io → `SHOTSTACK_API_KEY`
- ✅ **YouTube OAuth**: Google Cloud Console → `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`
- ✅ **GitHub Account**: Para sincronizar scripts

### Hardware
- **M1 (Video Upload)**: Cloudflare Workers (gratis)
- **M2 (Script Generator)**: Máquina local con Node.js 18+ O GitHub Actions (gratis)

---

## 🚀 MÁQUINA 1: Video Upload (Cloudflare Workers)

### 1. Clonar jovi-academy Worker

```bash
cd /Users/joseivananguianoreyes/Documents/mis-proyectos/jovi-academy
```

### 2. Actualizar wrangler.jsonc

Asegurar que el Worker lea del repo central:

```toml
[env.production]
routes = [
  { pattern = "example.com/*", zone_name = "example.com" }
]
vars = { CURRICULUM_REPO = "https://raw.githubusercontent.com/chirgone/youtube/main/curriculum" }
```

### 3. Configurar Secrets

```bash
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put PEXELS_API_KEY
npx wrangler secret put SHOTSTACK_API_KEY
npx wrangler secret put YOUTUBE_CLIENT_ID
npx wrangler secret put YOUTUBE_CLIENT_SECRET
npx wrangler secret put YOUTUBE_REFRESH_TOKEN
```

### 4. Crear KV Namespace para Tracking

```bash
npx wrangler kv:namespace create TRACKER
npx wrangler kv:namespace create TRACKER --preview
```

Actualizar `wrangler.jsonc`:
```toml
kv_namespaces = [
  { binding = "TRACKER", id = "your-id-here", preview_id = "your-preview-id" }
]
```

### 5. Actualizar src/index.ts

Agregar endpoint para consumir scripts de GitHub:

```typescript
// Fetch script from GitHub
async function getScriptFromGitHub(episodeNumber: number, env: Env): Promise<string> {
  const url = `https://raw.githubusercontent.com/chirgone/youtube/main/scripts/generated/episode-${episodeNumber}.md`;
  const response = await fetch(url);
  if (!response.ok) {
    console.log(`[GITHUB] Script ${episodeNumber} not found, using RSS fallback`);
    return null;
  }
  return response.text();
}
```

### 6. Deploy

```bash
npm run deploy
# o
npx wrangler deploy
```

### 7. Configurar Cron Jobs

En `wrangler.jsonc`:

```toml
triggers = { crons = ["0 6 * * *", "0 18 * * *"] }
```

- **6 AM UTC** → Video 1
- **6 PM UTC** → Video 2

---

## 💻 MÁQUINA 2: Script Generator

### Opción A: Máquina Local

#### 1. Clonar/Instalar

```bash
cd /Users/joseivananguianoreyes/Documents/mis-proyectos/youtube
cd scripts/generator
npm install
```

#### 2. Configurar .env

```bash
cp .env.example .env
# Editar .env con tu GROQ_API_KEY
```

#### 3. Ejecutar Manual (Test)

```bash
# Generar 5 scripts
BATCH_SIZE=5 npm run generate

# O batch de 10
BATCH_SIZE=10 npm run generate:batch
```

#### 4. Configurar Crontab (Auto)

```bash
# Editar crontab
crontab -e

# Agregar (genera scripts cada noche a las 3 AM UTC)
0 3 * * * cd /Users/joseivananguianoreyes/Documents/mis-proyectos/youtube/scripts/generator && npm run generate:batch >> logs/cron.log 2>&1

# O (3 AM hora local)
0 8 * * * cd /Users/joseivananguianoreyes/Documents/mis-proyectos/youtube/scripts/generator && npm run generate:batch >> logs/cron.log 2>&1
```

#### 5. Crear Script de Sync a GitHub

Crear `scripts/sync-to-github.sh`:

```bash
#!/bin/bash
cd /Users/joseivananguianoreyes/Documents/mis-proyectos/youtube

# Commit & push generated scripts
git add scripts/generated/
git commit -m "🤖 Auto-generated scripts batch - $(date)"
git push origin main

echo "✅ Scripts synced to GitHub"
```

Dar permisos:
```bash
chmod +x scripts/sync-to-github.sh
```

Agregar a crontab (después de generar scripts):
```bash
0 4 * * * /Users/joseivananguianoreyes/Documents/mis-proyectos/youtube/scripts/sync-to-github.sh >> /Users/joseivananguianoreyes/Documents/mis-proyectos/youtube/logs/sync.log 2>&1
```

---

### Opción B: GitHub Actions (Serverless)

Crear `.github/workflows/generate-scripts.yml`:

```yaml
name: Generate Scripts

on:
  schedule:
    # Cron: 3 AM UTC daily
    - cron: '0 3 * * *'
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd scripts/generator
          npm install
      
      - name: Generate scripts
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
        run: |
          cd scripts/generator
          npm run generate:batch
      
      - name: Commit & push
        run: |
          git config user.name "JOVI Bot"
          git config user.email "bot@jovi-academy.dev"
          git add scripts/generated/
          git commit -m "🤖 Auto-generated scripts batch - $(date)" || true
          git push
```

Agregar secret en GitHub:
- Settings → Secrets → `GROQ_API_KEY`

---

## 📊 Centro de Mando (Dashboard)

### Deploy automático en Cloudflare Pages

El workflow GitHub Actions (`deploy-dashboard.yml`) se ejecuta automáticamente cuando:
- Cambias archivos en `/dashboard/`
- Haces push a `main`

```bash
# Cambiar dashboard y push
echo "<!-- actualizado -->" >> dashboard/index.html
git add dashboard/
git commit -m "Update dashboard"
git push origin main

# ✅ Workflow se ejecuta automáticamente
# Verifica: https://github.com/chirgone/youtube/actions
```

### Configurar Cloudflare Pages (manual)

```bash
# Opción 1: Vía CLI
npx wrangler pages deploy dashboard/ --project-name jovi-academy-dashboard

# Opción 2: Vía GitHub
# 1. https://dash.cloudflare.com → Pages
# 2. Create → Connect to Git
# 3. Select chirgone/youtube
# 4. Build settings: none (HTML estático)
# 5. Deploy
```

### Configurar dominio custom: jovi-dashboard.angaflow.com

```bash
# En Cloudflare Dashboard:
# 1. Pages → jovi-academy-dashboard
# 2. Settings → Custom domains
# 3. Agregar: jovi-dashboard.angaflow.com
# 4. Validar CNAME en DNS (automático si domain en Cloudflare)
# 5. Esperar ~5 min para propagación

# Verificar:
curl https://jovi-dashboard.angaflow.com
# ✅ Dashboard live!
```

**Acceso**:
- Production: `https://jovi-dashboard.angaflow.com` ✅
- Fallback: `https://jovi-academy-dashboard.pages.dev`

**Con logo**: La imagen se carga de Cloudflare Image Delivery (CDN global)

---

## 🔗 Integración Entre Máquinas

### M1 → Lee scripts de GitHub

En `src/index.ts` (M1):

```typescript
async function getVideoScript(episodeNumber: number): Promise<string> {
  // Try GitHub first
  const githubUrl = `https://raw.githubusercontent.com/chirgone/youtube/main/scripts/generated/episode-${episodeNumber}.md`;
  const response = await fetch(githubUrl);
  
  if (response.ok) {
    return response.text(); // Usa script pre-generado
  }
  
  // Fallback: genera on-demand (slow path)
  return generateScriptWithGroq(...);
}
```

### M2 → Push a GitHub automático

```bash
# Crear GitHub token (Settings → Developer settings → Personal access tokens)
# Agregar a .env de generator
GITHUB_TOKEN=ghp_xxxxx
GITHUB_REPO=chirgone/youtube

# Script de push incluye auto-commit & push
```

---

## ✅ Checklist de Verificación

### M1
- [ ] Cloudflare Worker deployado
- [ ] KV Namespace creado
- [ ] Todos los secrets configurados
- [ ] Cron triggers activos (6 AM, 6 PM UTC)
- [ ] Endpoint `/health` responde
- [ ] Endpoint `/test/ai` genera video de prueba

### M2
- [ ] Node.js 18+ instalado
- [ ] npm dependencies instaladas
- [ ] `.env` configurado con GROQ_API_KEY
- [ ] `npm run generate` funciona
- [ ] Crontab/GitHub Actions configurado
- [ ] Scripts se generan automáticamente
- [ ] Git sync a chirgone/youtube funciona

### Dashboard
- [ ] Deployado en Cloudflare Pages
- [ ] Accesible en `*.pages.dev`
- [ ] Mock data mostrando (preproducción)
- [ ] Refresh button funciona

---

## 🔧 Comandos Útiles

### M1: Verificar logs

```bash
npx wrangler tail jovi-academy
```

### M2: Test manual

```bash
cd scripts/generator
BATCH_SIZE=1 npm run generate
ls generated/
```

### Dashboard: Local dev

```bash
cd dashboard
python3 -m http.server 8000
# Acceder: http://localhost:8000
```

### Sincronizar repo

```bash
cd /Users/joseivananguianoreyes/Documents/mis-proyectos/youtube
git pull origin main  # Get latest temario
git push origin main  # Push cambios locales
```

---

## 📈 Monitoreo & Alertas

### Configurar Slack (Opcional)

En M1 Worker, agregar notificaciones:

```typescript
async function notifySlack(message: string, env: Env) {
  await fetch(env.SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({ text: message }),
  });
}
```

### Health Checks

Endpoint `/health` en M1:

```bash
curl https://jovi-academy.example.com/health
# Response: { status: "ok", lastVideoTime: "...", nextVideoTime: "..." }
```

---

## 🚨 Troubleshooting

| Problema | Solución |
|----------|----------|
| "Script not found" | M2 no ha generado aún. Ejecutar manualmente: `npm run generate:batch` |
| "Groq API error" | Verificar `GROQ_API_KEY` en secrets. Chequear quota en https://console.groq.com |
| "YouTube auth failed" | Refresh token expirado. Regenerar con OAuth flow |
| "Videos no aparecen" | Chequear YouTube Studio. Verificar que esté public (no unlisted) |
| Cron no ejecuta | Verificar timezone. Cloudflare usa UTC. Ajustar según tu zona |

---

## 📞 Soporte

Para issues:
1. Revisar logs: `npx wrangler tail`
2. Testear endpoint: `/test/ai` en M1
3. Revisar dashboard: alertas de tokens/status
4. Check GitHub: últimos scripts generados

---

## 📝 Notas

- **Costo mensual**: ~$12-15 (Groq $0.20 + OpenAI $0.01 + Shotstack $12 + Cloudflare $0)
- **Escalabilidad**: Sistema soporta 10+ videos/día sin cambios
- **Backup**: Scripts almacenados en GitHub (no se pierden)
- **Versionamiento**: Git history preserva todas las versiones de temario

---

¡Listo! Sistema completamente configurado y automático. 🚀

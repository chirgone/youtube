# GitHub Actions Setup Guide

Configurar secrets y variables para que los workflows funcionen automáticamente.

---

## 📋 Secrets Requeridos

En **Settings → Secrets and variables → Actions**, agregar:

### 1. **GROQ_API_KEY** (obligatorio)
- Obtener: https://console.groq.com
- Permisos: Crear token para script generation
- Usar en: `generate-scripts.yml`

```bash
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

### 2. **CLOUDFLARE_API_TOKEN** (para dashboard deploy)
- Obtener: https://dash.cloudflare.com/profile/api-tokens
- Crear "Custom Token" con permisos:
  - Account → Cloudflare Pages → Edit
  - Workers → Worker Scripts → Edit
- Usar en: `deploy-dashboard.yml`

```bash
CLOUDFLARE_API_TOKEN=v1.xxxxxxxxxxxxx
```

### 3. **CLOUDFLARE_ACCOUNT_ID** (para dashboard deploy)
- Obtener: https://dash.cloudflare.com (esquina inferior izq)
- Usar en: `deploy-dashboard.yml`

```bash
CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxxxxx
```

---

## 🔐 Configuración de Secrets

### En GitHub (vía CLI)

```bash
cd /path/to/youtube

# Agregar cada secret
gh secret set GROQ_API_KEY --body "gsk_xxxxx"
gh secret set CLOUDFLARE_API_TOKEN --body "v1.xxxxx"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "xxxxxxx"

# Verificar
gh secret list
```

### En GitHub UI

1. Ir a: **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Agregar cada uno:
   - Name: `GROQ_API_KEY`
   - Value: `gsk_xxxxxxxxxxxxx`
4. Repeat for other secrets

---

## 🚀 Workflows Configurados

### 1. **generate-scripts.yml**
**Propósito**: Generar scripts automáticamente (M2)

```
Trigger: Diariamente 3 AM UTC
       O: Manual via workflow_dispatch

Pasos:
1. Checkout repo
2. Setup Node.js
3. Instalar dependencias (Groq SDK)
4. Ejecutar generator.js
5. Commit & push a GitHub
```

**Ejecutar manualmente**:
```bash
gh workflow run generate-scripts.yml --ref main
```

**Monitorear**:
```bash
gh run watch <run-id>
```

---

### 2. **health-check.yml**
**Propósito**: Verificar salud del sistema cada 6h

```
Trigger: Cada 6 horas
       O: Manual via workflow_dispatch

Pasos:
1. Verificar M1 Worker status
2. Verificar M2 scripts generados
3. Validar archivos curriculum
4. Generar reporte de salud
```

**Ejecutar manualmente**:
```bash
gh workflow run health-check.yml --ref main
```

---

### 3. **deploy-dashboard.yml**
**Propósito**: Desplegar dashboard a Cloudflare Pages

```
Trigger: Push a main en /dashboard
       O: Manual via workflow_dispatch

Pasos:
1. Checkout repo
2. Setup Cloudflare CLI
3. Deploy a Cloudflare Pages
4. Configurar dominio custom
5. Verificar accesibilidad
```

**Ejecutar manualmente**:
```bash
gh workflow run deploy-dashboard.yml --ref main
```

---

## 🔧 Primeros Pasos

### 1. Clonar repo con permisos

```bash
# Asegurarse que tienes acceso push
git clone https://github.com/chirgone/youtube.git
cd youtube
```

### 2. Agregar secrets

```bash
# Vía CLI (más rápido)
gh secret set GROQ_API_KEY --body "tu_groq_key"
gh secret set CLOUDFLARE_API_TOKEN --body "tu_cf_token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "tu_cf_id"

# Verificar
gh secret list
```

### 3. Probar workflows

```bash
# Test: Generate scripts
gh workflow run generate-scripts.yml -f batch_size=3

# Esperar a que complete
gh run list --limit 5

# Ver logs
gh run view <run-id> --log
```

### 4. Monitorear ejecuciones

En GitHub UI:
- **Actions** tab → ver workflows
- Click en workflow para detalles
- Ver logs de cada step

---

## 📊 Dashboard Deploy (Cloudflare Pages)

### Opción 1: Automático (Recomendado)

El workflow `deploy-dashboard.yml` se ejecuta automáticamente cuando:
- Cambias archivos en `/dashboard/`
- Haces push a `main`

```bash
# Cambiar dashboard
echo "<!-- updated -->" >> dashboard/index.html

# Commit & push
git add dashboard/
git commit -m "Update dashboard"
git push origin main

# Workflow dispara automáticamente
# Verifica en: https://github.com/chirgone/youtube/actions
```

### Opción 2: Manual

```bash
# Deploy manualmente
gh workflow run deploy-dashboard.yml

# Verificar
curl https://jovi-academy-dashboard.pages.dev
```

### Configurar dominio custom

Una vez deployado en Pages:

1. Ir a: Cloudflare Dashboard → Pages → jovi-academy-dashboard
2. Settings → Custom domains
3. Agregar: `jovi-dashboard.angaflow.com`
4. Esperar validación DNS (~5 min)

---

## 🐛 Troubleshooting

### "Secret not found" en workflow

```
❌ Error: Secrets are not being used
```

**Solución**:
1. Verificar que secret esté agregado: `gh secret list`
2. Verificar nombre exacto (case-sensitive)
3. Esperar ~1 min después de agregar secret
4. Re-trigger workflow: `gh workflow run <name>`

### "GROQ API Error" en scripts generation

```
❌ Error: GROQ_API_KEY not valid
```

**Solución**:
1. Verificar que key sea válida: https://console.groq.com
2. Verificar que secret esté seteado: `gh secret list`
3. Re-run: `gh workflow run generate-scripts.yml`

### "Cloudflare deployment failed"

```
❌ Error: Invalid API token
```

**Solución**:
1. Regenerar API token: https://dash.cloudflare.com/profile/api-tokens
2. Actualizar secret: `gh secret set CLOUDFLARE_API_TOKEN`
3. Re-run: `gh workflow run deploy-dashboard.yml`

### "Dashboard not accessible"

```
❌ https://jovi-dashboard.angaflow.com not found
```

**Solución**:
1. Verificar deployment: `gh workflow run list`
2. Verificar custom domain: Cloudflare Pages settings
3. Puede tomar 5-10 min después de deploy
4. Si CNAME not set, agregar en DNS Cloudflare

---

## 📈 Monitoreo

### Ver últimas ejecuciones

```bash
gh run list --limit 10
```

### Ver logs de ejecución

```bash
# Listar runs
gh run list

# Ver específico
gh run view <RUN_ID> --log
```

### Habilitar notificaciones

En GitHub: **Settings → Notifications → Workflow runs**
- ✅ "Notify me when a job in a workflow run starts"
- ✅ "Notify me when a job in a workflow run completes"

---

## 🎯 Checklist Final

- [ ] `GROQ_API_KEY` agregado
- [ ] `CLOUDFLARE_API_TOKEN` agregado
- [ ] `CLOUDFLARE_ACCOUNT_ID` agregado
- [ ] Verificar `gh secret list` muestra todos
- [ ] Test `generate-scripts.yml` manualmente
- [ ] Test `deploy-dashboard.yml` manualmente
- [ ] Dashboard accesible en `jovi-dashboard.angaflow.com`
- [ ] Scripts generándose automáticamente cada noche
- [ ] Health checks ejecutándose cada 6h

---

## 📚 Referencias

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Secrets and variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Workflow triggers](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [Cloudflare Pages Deploy](https://developers.cloudflare.com/pages/get-started/)
- [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)

---

**¡Configurado! GitHub Actions automatiza todo.** 🚀

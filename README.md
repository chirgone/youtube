# JOVI Academy - Automated YouTube Channel

🎬 **Generador automático de videos YouTube**: 2 videos/día en español sobre ciberseguridad e IA.

**Canal**: [@JOVI-Academy](https://www.youtube.com/@JOVI-Academy)  
**Dashboard**: [jovi-dashboard.angaflow.com](https://jovi-dashboard.angaflow.com)  
**Tech Stack**: Cloudflare Workers, Groq LLM, OpenAI TTS, Shotstack API

---

## 🎯 Visión General

- **2 videos/día** (730/año) sobre ciberseguridad & IA
- **Temario estructurado**: 52 semanas + contenido RSS viral
- **Totalmente automático**: Cron jobs + AI pipeline + YouTube upload
- **Bajo costo**: ~$12-15/mes

### Pipeline Completo

```
Máquina 1 (6 AM & 6 PM UTC)
├─ Lee temario + RSS feeds
├─ Groq: genera script 600-800 chars
├─ OpenAI TTS: audio narración en español
├─ Pexels: busca imágenes relevantes
├─ Shotstack: render video MP4
└─ YouTube: sube automático + metadata

Máquina 2 (3 AM UTC)
├─ Lee temario 2026
├─ Groq: pre-genera 10 scripts/noche
├─ Guarda en GitHub
└─ M1 consume on-demand (fallback RSS)
```

---

## 📁 Estructura del Repo

```
chirgone/youtube/
├── README.md (este archivo)
├── SETUP.md (guía completa de configuración)
│
├── curriculum/2026/
│   ├── 2026-q1.json (24 episodios: Zero Trust, IAM, Cloud basics)
│   ├── 2026-q2.json (28 episodios: Workers, Pages, WAF, DDoS, One)
│   ├── 2026-q3.json (32 episodios: LLMs, AI Security, Agents, Privacy)
│   └── 2026-q4.json (40 episodios: DevSecOps, careers, tendencias)
│
├── scripts/
│   ├── generator/
│   │   ├── src/generator.js (script generador Groq)
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── src/batch-generator.js (genera 10 scripts/noche)
│   │
│   ├── generated/ (scripts pre-generados, creados por M2)
│   │   ├── week-01-episode-01.md
│   │   ├── week-01-episode-02.md
│   │   └── index.json (metadata & timestamps)
│   │
│   └── sync-to-github.sh (auto-commit & push)
│
├── dashboard/
│   ├── index.html (control center UI)
│   ├── styles.css (diseño)
│   ├── main.js (lógica & mock data)
│   ├── api.js (placeholder para real API)
│   └── wrangler.json (config Pages deploy)
│
├── machines/
│   ├── machine-1-jovi-academy/
│   │   ├── wrangler.jsonc (Worker config)
│   │   ├── src/index.ts (cron + video generation)
│   │   └── cron-jobs/ (instrucciones)
│   │
│   └── machine-2-script-generator/
│       ├── setup.sh (instalación)
│       └── cron-jobs/ (instrucciones)
│
├── monitoring/
│   ├── health-check.js (verifica M1 + M2)
│   └── alerts.json (config alertas)
│
└── .github/
    └── workflows/
        ├── generate-scripts.yml (GitHub Actions: auto-generar scripts)
        └── health-check.yml (verificar sistema cada 6h)
```

---

## 🚀 Quick Start (3 pasos)

### PASO 1: Clonar repo

```bash
git clone https://github.com/chirgone/youtube.git
cd youtube
```

### PASO 2: Configurar Máquina 1 (Cloudflare Worker)

```bash
cd machines/machine-1-jovi-academy

# Copiar secrets
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put PEXELS_API_KEY
npx wrangler secret put SHOTSTACK_API_KEY
npx wrangler secret put YOUTUBE_REFRESH_TOKEN

# Deploy
npm run deploy
```

### PASO 3: Configurar Máquina 2 (Local o GitHub Actions)

```bash
cd scripts/generator
cp .env.example .env
# Editar .env con GROQ_API_KEY

# Test
npm run generate

# O usar GitHub Actions (automático)
```

**Detalles completos**: Ver [SETUP.md](SETUP.md)

---

## 📊 Centro de Mando

Acceder a **[jovi-dashboard.angaflow.com](https://jovi-dashboard.angaflow.com)**

Muestra en tiempo real:
- ✅ Estado de Máquina 1 (Video Upload)
- ✅ Estado de Máquina 2 (Script Generator)
- 📊 Resumen: videos/mes, scripts listos, uptime, costo
- ⚠️ Alertas automáticas (tokens bajos, errores, etc)

---

## 📚 Temario 2026 (124 episodios)

### Q1: Fundamentos (24 episodios)
- Zero Trust basics & arquitectura
- Identity & Access Management (IAM)
- Cloud Security & misconfigurations
- Criptografía sin matemáticas
- Network Segmentation & firewalls

### Q2: Cloudflare Deep Dive (28 episodios)
- Workers: serverless en el edge
- Pages: frontend moderno
- DDoS Protection & WAF
- API Security
- Workers AI & LLMs
- Cloudflare One: Zero Trust completo

### Q3: IA & Automation (32 episodios)
- LLM basics (tokens, temperature, context window)
- Hallucinations & biases
- Prompt Engineering & RAG
- IA Security: poisoning, stealing, adversarial
- AI Agents autónomos
- Automation: IaC, CI/CD, Workflows
- Data Privacy & Compliance (GDPR, CCPA, LGPD)

### Q4: Advanced & Careers (40 episodios)
- Incident Response playbooks
- Red Teaming & pentesting
- Threat Intelligence & MITRE ATT&CK
- Infrastructure as Code Security
- Observability: Logs, Metrics, Traces
- Tendencias 2026 (Quantum, Blockchain, Edge)
- Carreras: CISSP, CEH, AI Engineer (salarios)

---

## 🔑 APIs Requeridas

| API | Costo | Uso | Key |
|-----|-------|-----|-----|
| **Groq** | Gratis | LLM (scripts) | `GROQ_API_KEY` |
| **OpenAI** | $0.015/1M chars | TTS (narración) | `OPENAI_API_KEY` |
| **Pexels** | Gratis | Imágenes | `PEXELS_API_KEY` |
| **Shotstack** | $0.20/video | Render MP4 | `SHOTSTACK_API_KEY` |
| **YouTube** | Gratis | Upload videos | OAuth tokens |
| **Cloudflare** | Gratis | Workers + Pages | (incluido) |

**Costo total/mes**: ~$12-15

---

## 📈 Ejecución Automática

### Máquina 1: Cron Jobs (Cloudflare Workers)

```
0 6 * * *  → 6 AM UTC: Genera video 1
0 18 * * * → 6 PM UTC: Genera video 2
```

### Máquina 2: Generador de Scripts

**Opción A: Máquina Local**
```bash
# Crontab (cada noche 3 AM UTC)
0 3 * * * npm run generate:batch
```

**Opción B: GitHub Actions (automático)**
```yaml
schedule:
  - cron: '0 3 * * *'  # 3 AM UTC
```

---

## 🎥 Cómo Funciona el Pipeline

### Generación de Script (M2, 5 segundos)
```
Temario 2026 (JSON)
    ↓
Groq LLM: genera 600-800 chars en español
    ↓
Guarda: scripts/generated/week-XX-episode-YY.md
    ↓
Git push a chirgone/youtube automático
```

### Generación de Video (M1, 2-3 minutos)
```
Lee script (GitHub o RSS fallback)
    ↓
OpenAI TTS: audio MP3 (Spanish, nova voice, 1.0x speed)
    ↓
Pexels API: busca imágenes por keywords
    ↓
Shotstack API: renderiza video MP4 (1080p, background music)
    ↓
YouTube API: sube con metadata (title, description, tags, thumbnail)
    ↓
Live en @JOVI-Academy
```

---

## 📝 Ejemplo: Script Generado

```markdown
# Zero Trust: La revolución en seguridad que Google inició

**Episode**: 1
**Week**: 1
**Difficulty**: beginner
**Duration**: 3:45
**Characters**: 742

## Script

¡Hola! Si trabajas en tecnología, seguro escuchaste "Zero Trust" en los últimos años.

Google lo inventó porque su VPN tradicional no aguantaba a sus 100,000 empleados remotos. 
Hoy, empresas como Microsoft, Amazon y Cloudflare lo usan. ¿Por qué?

Porque confiar en todo lo que entra a tu red = desastre.

Zero Trust dice: "No confíes en nada, verifica TODO."

Verificas:
1. Quién eres (identidad)
2. De dónde conectas (ubicación)
3. En qué dispositivo estás (¿está seguro?)
4. Qué intentas hacer (permiso específico)

Con este sistema, aunque alguien hackee una máquina, NO puede ir a otros lados.

Es como entrar a un banco: no basta mostrar tu cédula en la puerta. 
En cada habitación, muestras credenciales nuevamente.

Si quieres entender Zero Trust a fondo, entra a developers.cloudflare.com/cloudflare-one

¡Nos vemos en el próximo video!
```

---

## 🛠️ Tecnologías Clave

| Componente | Tecnología | Por qué |
|------------|-----------|--------|
| **Hosting** | Cloudflare Workers | Edge computing global, <50ms latency |
| **LLM** | Groq (llama-3.3-70b) | Gratis, rápido, multilingüe |
| **TTS** | OpenAI (nova voice) | Mejor calidad en español, $0.001/mes |
| **Video** | Shotstack API | Render serverless, $0.20/video |
| **Storage** | Cloudflare KV + GitHub | Distribuido, versionado |
| **Dashboard** | Cloudflare Pages | Gratis, SPA estático |
| **CI/CD** | GitHub Actions | Gratis, integrado |

---

## 📊 Métricas

### Capacidad
- **2 videos/día** = 730/año
- **Temario estructurado**: 124 episodios curados
- **RSS fallback**: contenido viral actualizado diariamente
- **Escalable**: +10 videos/día sin cambios arquitectónicos

### Costo
- **Groq**: $0.20/mes (generosa quota gratis)
- **OpenAI TTS**: $0.01/mes (60 videos × 600 chars)
- **Shotstack**: $12/mes (60 videos × $0.20)
- **Cloudflare**: $0 (Workers + Pages gratis)
- **Total**: **$12.21/mes**

### Ingresos (Proyectados, mes 6+)
- **YouTube AdSense**: $500-2000/mes (20k suscriptores)
- **Cloudflare Affiliate**: $1-3k/mes (comisiones)
- **Cursos/Membresía**: $2-5k/mes (Gumroad)
- **Total**: **$3.5-10k/mes**

---

## 🚀 Roadmap

### Fase 1: MVP (Actual)
- ✅ Temario 2026 completado
- ✅ Máquina 1 (Worker) funcionando
- ✅ Máquina 2 (Script generator) ready
- ✅ Dashboard básico
- ⏳ Primeros 100 videos publicados

### Fase 2: Escalabilidad (Mes 2-3)
- [ ] Integrar more RSS feeds (Krebs, ZDNet)
- [ ] Mejorar TTS con libtts (on-device)
- [ ] Analytics avanzados en dashboard
- [ ] Webhook alerts (Slack, Discord)
- [ ] Subtítulos automáticos (CC)

### Fase 3: Monetización (Mes 4-6)
- [ ] YouTube Partner Program (monetización)
- [ ] Cloudflare Affiliate Program
- [ ] Gumroad: mini-cursos ($9-49)
- [ ] Patreon: membresía mensual
- [ ] Sponsor outreach (Cloudflare, Coursera, etc)

### Fase 4: Comunidad (Mes 6+)
- [ ] Discord community
- [ ] Weekly live streams
- [ ] Guest experts interviews
- [ ] Certificación custom JOVI

---

## 🤝 Contribuir

Sugerir temas o reportar bugs:
1. Fork repo
2. Crear issue o PR
3. Mention `@chirgone` para review

---

## 📞 Soporte

- **Issues**: https://github.com/chirgone/youtube/issues
- **Dashboard**: [jovi-dashboard.angaflow.com](https://jovi-dashboard.angaflow.com) → Estado de máquinas
- **Email**: janguiano@cloudflare.com

---

## 📜 Licencia

MIT - Libre para usar, modificar, distribuir.

---

## 🙏 Créditos

- **Groq**: LLM gratis y rápido
- **Cloudflare**: Workers + Pages + KV
- **OpenAI**: TTS en español
- **Shotstack**: Video rendering serverless
- **YouTube**: Hosting + monetización
- **Elements of AI**: Inspiración en educación accesible

---

**Hecho con ❤️ por Ivan Anguiano**

🚀 **Join us**: Subscribe [@JOVI-Academy](https://www.youtube.com/@JOVI-Academy)

Ver [SETUP.md](SETUP.md) para guía de configuración completa.

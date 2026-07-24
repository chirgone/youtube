// Update last update timestamp
function updateLastUpdate() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-ES', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  document.getElementById('lastUpdate').textContent = `Actualizado: ${timeStr}`;
}

// Mock data structure - Replace with real API calls
function getMockData() {
  return {
    machine1: {
      name: 'Video Upload',
      status: 'healthy',
      nextExecution: '2026-07-24T18:00:00Z',
      lastVideos: [
        {
          title: 'BGP ORIGIN attribute',
          timestamp: '2026-07-24T15:30:00Z',
          duration: '3:45',
          status: 'published',
        },
        {
          title: 'Zero Trust en acción',
          timestamp: '2026-07-24T09:30:00Z',
          duration: '4:02',
          status: 'published',
        },
        {
          title: 'Quantum y criptografía',
          timestamp: '2026-07-23T18:00:00Z',
          duration: '3:58',
          status: 'error',
          error: 'TTS API timeout',
        },
      ],
      tokens: {
        openai: { name: 'OPENAI_API_KEY', usage: 15, limit: 100, unit: '$' },
        youtube: { name: 'YOUTUBE_TOKEN', usage: 50, limit: 100, unit: '%' },
        groq: { name: 'GROQ_API_KEY', usage: 85, limit: 100, unit: '%' },
        pexels: { name: 'PEXELS_API_KEY', usage: 30, limit: 100, unit: '%' },
      },
      rss: { articles: 12, newToday: 3 },
    },
    machine2: {
      name: 'Script Generator',
      status: 'healthy',
      nextExecution: '2026-07-25T03:00:00Z',
      scriptsGenerated: 47,
      scriptsTotal: 365,
      tokens: {
        groq: { name: 'GROQ_API_KEY', usage: 45, limit: 100, unit: '%' },
      },
      lastBatch: {
        timestamp: '2026-07-24T03:00:00Z',
        count: 10,
        status: 'success',
      },
    },
    summary: {
      videosThisMonth: 52,
      videosPublished: 46,
      scriptsPending: 6,
      scriptsGenerated: 47,
      uptime: 99.8,
      costMonth: 14.2,
    },
  };
}

// Render machine 1 data
function renderMachine1(data) {
  const m1 = data.machine1;

  // Next execution
  const nextDate = new Date(m1.nextExecution);
  const nextStr = nextDate.toLocaleTimeString('es-ES', { hour12: false });
  document.getElementById('m1-next').textContent = `${nextStr} UTC`;

  // Videos
  const videosHtml = m1.lastVideos
    .map(
      (video) => `
    <div class="video-item">
      <div style="display: flex; align-items: center; flex: 1;">
        <span class="status-icon">${video.status === 'published' ? '✅' : '⚠️'}</span>
        <div style="flex: 1;">
          <div class="title">${video.title}</div>
          <div class="meta">${video.duration} • ${new Date(video.timestamp).toLocaleString('es-ES')}</div>
          ${video.error ? `<div style="color: #dc3545; font-size: 0.8em; margin-top: 4px;">Error: ${video.error}</div>` : ''}
        </div>
      </div>
    </div>
  `
    )
    .join('');
  document.getElementById('m1-videos').innerHTML = videosHtml;

  // Tokens
  const tokensHtml = Object.entries(m1.tokens)
    .map(
      ([key, token]) => `
    <div class="token-item">
      <div class="name">${token.name}</div>
      <div class="status">
        <span class="status-icon">${token.usage > 80 ? '⚠️' : '✅'}</span>
        <span class="status-text">${token.usage}${token.unit} / ${token.limit}${token.unit}</span>
      </div>
      <div class="usage-bar">
        <div class="usage-fill" style="width: ${token.usage}%; background: ${token.usage > 80 ? '#dc3545' : '#28a745'};"></div>
      </div>
    </div>
  `
    )
    .join('');
  document.getElementById('m1-tokens').innerHTML = tokensHtml;

  // RSS
  document.getElementById(
    'm1-rss'
  ).innerHTML = `<strong>${m1.rss.articles}</strong> artículos total, <strong>${m1.rss.newToday}</strong> nuevos hoy`;

  // Update status
  const statusBadge = document.querySelector('#machine1 .status-badge');
  statusBadge.className = 'status-badge status-healthy';
  statusBadge.textContent = '✅ Healthy';
}

// Render machine 2 data
function renderMachine2(data) {
  const m2 = data.machine2;

  // Next execution
  const nextDate = new Date(m2.nextExecution);
  const nextStr = nextDate.toLocaleTimeString('es-ES', { hour12: false });
  document.getElementById('m2-next').textContent = `${nextStr} UTC`;

  // Scripts
  const scriptsPercent = Math.round((m2.scriptsGenerated / m2.scriptsTotal) * 100);
  document.getElementById(
    'm2-scripts'
  ).innerHTML = `
    <div style="text-align: center;">
      <div class="value" style="color: #667eea; font-size: 2em; margin-bottom: 8px;">${m2.scriptsGenerated}</div>
      <div class="label">${m2.scriptsTotal} necesarios (${scriptsPercent}%)</div>
      <div style="background: #e0e0e0; height: 8px; border-radius: 4px; margin-top: 10px; overflow: hidden;">
        <div style="background: #667eea; height: 100%; width: ${scriptsPercent}%; transition: width 0.3s;"></div>
      </div>
      <div class="label" style="margin-top: 8px;">Suficiente para ${Math.floor((m2.scriptsGenerated / 2) * 1)}-${Math.floor((m2.scriptsGenerated / 2) * 2)} días</div>
    </div>
  `;

  // Tokens
  const tokensHtml = Object.entries(m2.tokens)
    .map(
      ([key, token]) => `
    <div class="token-item">
      <div class="name">${token.name}</div>
      <div class="status">
        <span class="status-icon">${token.usage > 80 ? '⚠️' : '✅'}</span>
        <span class="status-text">${token.usage}${token.unit} / ${token.limit}${token.unit}</span>
      </div>
      <div class="usage-bar">
        <div class="usage-fill" style="width: ${token.usage}%; background: ${token.usage > 80 ? '#dc3545' : '#28a745'};"></div>
      </div>
    </div>
  `
    )
    .join('');
  document.getElementById('m2-tokens').innerHTML = tokensHtml;

  // Batch info
  const batchDate = new Date(m2.lastBatch.timestamp);
  document.getElementById(
    'm2-batch'
  ).innerHTML = `✅ <strong>${m2.lastBatch.count} scripts</strong> generados ${batchDate.toLocaleString('es-ES')}`;

  // Update status
  const statusBadge = document.querySelector('#machine2 .status-badge');
  statusBadge.className = 'status-badge status-healthy';
  statusBadge.textContent = '✅ Healthy';
}

// Render summary
function renderSummary(data) {
  const summary = data.summary;
  document.getElementById('summary-videos').textContent = `${summary.videosPublished}/${summary.videosThisMonth}`;
  document.getElementById('summary-scripts').textContent = summary.scriptsGenerated;
  document.getElementById('summary-uptime').textContent = `${summary.uptime}%`;
  document.getElementById('summary-cost').textContent = `$${summary.costMonth.toFixed(2)}`;
}

// Render alerts
function renderAlerts(data) {
  const alerts = [];

  // Check GROQ quota
  if (data.machine1.tokens.groq.usage > 80) {
    alerts.push({
      type: 'warning',
      message: `⚠️ GROQ quota en M1: ${data.machine1.tokens.groq.usage}% - considerar upgrade`,
    });
  }

  // Check last video error
  const lastVideo = data.machine1.lastVideos[0];
  if (lastVideo.status === 'error') {
    alerts.push({
      type: 'error',
      message: `❌ Error en video anterior: ${lastVideo.error} - revisar logs`,
    });
  }

  // Check scripts buffer
  const daysBuffer = Math.floor((data.machine2.scriptsGenerated / 2) * 1);
  if (daysBuffer < 7) {
    alerts.push({
      type: 'warning',
      message: `⚠️ Buffer de scripts bajo: ${daysBuffer} días - aumentar batch size`,
    });
  }

  // OK if no critical issues
  if (alerts.length === 0) {
    alerts.push({
      type: 'success',
      message: '✅ Todo en orden - sistema funcionando correctamente',
    });
  }

  const alertsHtml = alerts
    .map(
      (alert) => `
    <div class="alert alert-${alert.type}">
      <span class="alert-message">${alert.message}</span>
    </div>
  `
    )
    .join('');
  document.getElementById('alerts').innerHTML = alertsHtml;
}

// Main render function
function render() {
  const data = getMockData();

  renderMachine1(data);
  renderMachine2(data);
  renderSummary(data);
  renderAlerts(data);
  updateLastUpdate();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  render();

  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', () => {
    document.getElementById('refreshBtn').textContent = '🔄 Actualizando...';
    setTimeout(() => {
      render();
      document.getElementById('refreshBtn').textContent = '🔄 Actualizar';
    }, 1000);
  });

  // Auto-refresh every 5 minutes
  setInterval(render, 5 * 60 * 1000);
});

import type { EchoMoodSummary } from '../types/domain'

const pageCss = 'body{margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#140d2e;color:#f7f4ff}main{max-width:42rem;margin:auto;padding:24px}.c{border:1px solid #ffffff29;border-radius:24px;padding:22px;background:linear-gradient(160deg,#2a2063,#1a1340)}h1{margin:0 0 6px;font-size:1.7rem}.d{color:#c7bfe6}.pill{display:inline-block;margin:6px 6px 0 0;padding:7px 10px;border-radius:999px;background:#ffffff14;border:1px solid #ffffff29}.q{color:#7fd6ff;font-style:italic}.s{line-height:1.55}'

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

export function createQrDataUrl(summary: EchoMoodSummary) {
  const chips = summary.priorities
    .map((card) => `<span class="pill">${escapeHtml(card.emoji)} ${escapeHtml(card.label)}</span>`)
    .join('')

  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EchoMood</title><style>${pageCss}</style></head><body><main><section class="c"><h1>EchoMood Ortho</h1><p class="d">${escapeHtml(summary.date)} • ${escapeHtml(summary.weather.emoji)} ${escapeHtml(summary.weather.label)}</p><h2>Synthèse</h2><p class="s">${escapeHtml(summary.synthesis)}</p><h2>Priorités</h2>${chips}<h2>Question d’ouverture</h2><p class="q">${escapeHtml(summary.suggestedQuestion)}</p></section></main></body></html>`

  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
}

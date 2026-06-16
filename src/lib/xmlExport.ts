import type { EchoMoodEntry } from '../types/domain'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function cardXml(tag: string, cards: EchoMoodEntry['selected']) {
  return cards
    .map(
      (card) =>
        `    <${tag} id="${escapeXml(card.id)}" group="${escapeXml(card.group)}"><emoji>${escapeXml(card.emoji)}</emoji><label>${escapeXml(card.label)}</label></${tag}>`,
    )
    .join('\n')
}

export function createSummaryXml(entry: EchoMoodEntry) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<echomood version="1.0" type="synthese">
  <entry id="${escapeXml(entry.id)}" perspective="${escapeXml(entry.perspective ?? 'patient')}" date="${escapeXml(entry.date)}" createdAt="${escapeXml(entry.createdAt)}">
    <impactScore>${entry.impactScore ?? ''}</impactScore>
    <weather id="${escapeXml(entry.weather.id)}" score="${entry.weatherScore}">
      <emoji>${escapeXml(entry.weather.emoji)}</emoji>
      <label>${escapeXml(entry.weather.label)}</label>
    </weather>
    <selected>
${cardXml('card', entry.selected)}
    </selected>
    <priorities>
${cardXml('priority', entry.priorities)}
    </priorities>
    <synthesis>${escapeXml(entry.synthesis)}</synthesis>
    <suggestedQuestion>${escapeXml(entry.suggestedQuestion)}</suggestedQuestion>
  </entry>
</echomood>`
}

export function createHistoryXml(entries: EchoMoodEntry[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<echomood version="1.0" type="evolution">
  <entries count="${entries.length}">
${entries.map((entry) => createSummaryXml(entry).split('\n').slice(2, -1).join('\n')).join('\n')}
  </entries>
</echomood>`
}

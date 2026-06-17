import { useEffect, useMemo, useState } from 'react'
import { difficultyDictionary, resourceDictionary, weatherDictionary, weightDictionary } from '../lib/echoMoodCodec'
import { EchoMoodRosace } from './EchoMoodRosace'
import type { EchoMood } from '../types/domain'

function dominant<T extends string>(values: T[], fallback: T) {
  const counts = values.reduce((acc, value) => ({ ...acc, [value]: (acc[value] ?? 0) + 1 }), {} as Record<T, number>)
  return (Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] as T) ?? fallback
}

function periodSummary(history: EchoMood[]) {
  const latest = history.at(-1)!
  const allCards = history.flatMap((entry) => [...entry.selectedResources, ...entry.selectedDifficulties])
  const cardCounts = allCards.reduce((acc, id) => ({ ...acc, [id]: (acc[id] ?? 0) + 1 }), {} as Record<string, number>)
  const max = Math.max(...Object.values(cardCounts), 1)
  const frequencies = Object.fromEntries(Object.entries(cardCounts).map(([id, count]) => [id, count / max]))
  const dailyCard = dominant(history.map((entry) => entry.dailyCard), latest.dailyCard)
  return {
    echoMood: {
      ...latest,
      weather: dominant(history.map((entry) => entry.weather), latest.weather),
      weight: dominant(history.map((entry) => entry.weight), latest.weight),
      selectedResources: Object.keys(resourceDictionary) as EchoMood['selectedResources'],
      selectedDifficulties: Object.keys(difficultyDictionary) as EchoMood['selectedDifficulties'],
      dailyCard,
    },
    frequencies,
    recentIds: history.slice(-3).map((entry) => entry.dailyCard),
    top3: Object.entries(cardCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([id]) => resourceDictionary[id as keyof typeof resourceDictionary]?.label ?? difficultyDictionary[id as keyof typeof difficultyDictionary]?.label ?? id),
  }
}

export function EchoMoodTimelineRosace({ history }: { history: EchoMood[] }) {
  const [index, setIndex] = useState(Math.max(0, history.length - 1))
  const [playing, setPlaying] = useState(false)
  const [periodMode, setPeriodMode] = useState(false)
  const summary = useMemo(() => history.length ? periodSummary(history) : null, [history])
  const current = history[index]

  useEffect(() => {
    if (!playing || periodMode || history.length < 2) return
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % history.length), 1300)
    return () => window.clearInterval(timer)
  }, [playing, periodMode, history.length])

  if (!history.length) return <p className="empty-history">Aucune rosace enregistrée pour le moment.</p>
  const displayed = periodMode ? summary!.echoMood : current
  return <section className="timeline-rosace-panel">
    <div className="timeline-toolbar"><button className="btn btn-secondary" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? '⏸️ Pause' : '▶️ Play'}</button><button className="btn btn-secondary" type="button" onClick={() => setPeriodMode((value) => !value)}>{periodMode ? 'Voir par date' : 'Synthèse période'}</button></div>
    <EchoMoodRosace echoMood={displayed} variant={periodMode ? 'summary' : 'single'} showLegend animated={false} frequencies={summary?.frequencies} recentIds={periodMode ? summary?.recentIds : []} />
    {!periodMode && <><input className="timeline-slider" type="range" min="0" max={history.length - 1} value={index} onChange={(event) => setIndex(Number(event.target.value))} /><p className="result-date">{new Date(current.date).toLocaleDateString('fr-FR', { dateStyle: 'full' })} · {weatherDictionary[current.weather].emoji} {weightDictionary[current.weight].emoji}</p></>}
    {periodMode && <p className="period-sentence">Sur cette période, les éléments les plus présents sont : {summary!.top3.join(', ') || 'aucun élément récurrent'}.</p>}
  </section>
}

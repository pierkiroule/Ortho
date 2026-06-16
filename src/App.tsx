import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { toPng } from 'html-to-image'
import { CardButton } from './components/CardButton'
import { Constellation } from './components/Constellation'
import { Progress } from './components/Progress'
import { cards, weatherOptions } from './data/echomood'
import { loadHistory, upsertEntry } from './lib/history'
import { createSummary } from './lib/synthesis'
import { createHistoryXml, createSummaryXml } from './lib/xmlExport'
import type { EchoMoodEntry, WeatherOption } from './types/domain'
import './styles/app.css'

const maxPriorities = 3

type Screen = 1 | 2 | 3 | 4 | 5 | 6

function App() {
  const [screen, setScreen] = useState<Screen>(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [priorityIds, setPriorityIds] = useState<string[]>([])
  const [weather, setWeather] = useState<WeatherOption | null>(null)
  const [toast, setToast] = useState('')
  const [history, setHistory] = useState<EchoMoodEntry[]>([])
  const [savedEntry, setSavedEntry] = useState<EchoMoodEntry | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => setHistory(loadHistory()), [])

  const selectedCards = useMemo(() => cards.filter((card) => selectedIds.includes(card.id)), [selectedIds])
  const priorityCards = useMemo(() => cards.filter((card) => priorityIds.includes(card.id)), [priorityIds])
  const summary = savedEntry ?? (weather ? createSummary(selectedCards, priorityCards, weather) : null)

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function goTo(next: Screen) {
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      setPriorityIds((priorities) => priorities.filter((priority) => next.includes(priority)))
      return next
    })
  }

  function togglePriority(id: string) {
    setPriorityIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= maxPriorities) {
        notify('Tu peux choisir 3 priorités maximum')
        return current
      }
      return [...current, id]
    })
  }

  function showSummary() {
    if (!weather) return
    const entry = createSummary(selectedCards, priorityCards, weather)
    setSavedEntry(entry)
    setHistory(upsertEntry(entry))
    goTo(5)
  }

  async function copySynthesis() {
    if (!summary) return
    await navigator.clipboard.writeText(`${summary.synthesis}\n\nQuestion d’ouverture suggérée : ${summary.suggestedQuestion}`)
    notify('Synthèse copiée !')
  }

  async function downloadPng(target: HTMLDivElement | null, filename: string) {
    if (!target) return
    notify('Préparation de l’image…')
    const dataUrl = await toPng(target, { backgroundColor: '#1a1340', pixelRatio: 2 })
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  }

  function downloadXml(content: string, filename: string) {
    const blob = new Blob([content], { type: 'application/xml;charset=utf-8' })
    const link = document.createElement('a')
    link.download = filename
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
    notify('Fichier XML prêt à partager')
  }

  function reset() {
    setSelectedIds([])
    setPriorityIds([])
    setWeather(null)
    setSavedEntry(null)
    goTo(1)
  }

  return (
    <main className={`app screen-${screen}`}>
      {screen === 1 && (
        <section className="screen home-screen">
          <div className="hero">
            <div className="hero-orbit" aria-hidden="true"><span>😁</span><span>✨</span><span>🦷</span><span>💪</span></div>
            <span className="hero-badge">✨ Ta constellation du jour</span>
            <h1 className="hero-title" aria-label="EchoMood•°"><span className="hero-title-word">EchoMood</span><span className="hero-title-mark">•°</span><span className="hero-title-accent">Ortho</span></h1>
            <p className="hero-tagline">l’écho de ton vécu par rapport aux soins du moment <span className="tagline-mark">•°</span></p>
            <p className="hero-subtitle">Comment se vit ton traitement en ce moment ?</p>
            <p className="hero-text">Une webapp locale, sans serveur, pour créer une synthèse visuelle et conserver l’évolution dans un historique privé sur cet appareil.</p>
            <button className="btn btn-primary" type="button" onClick={() => goTo(2)}>Commencer mon EchoMood</button>
            <button className="btn btn-secondary" type="button" onClick={() => goTo(6)}>📈 Voir l’historique</button>
          </div>
        </section>
      )}

      {screen === 2 && (
        <section className="screen">
          <Header back={() => goTo(1)} step={1} />
          <h2 className="screen-title">Choisis ce qui correspond à ton vécu aujourd’hui.</h2>
          <CardGroup title="🌟 Ce qui te soutient" group="resource" selectedIds={selectedIds} onToggle={toggleSelected} />
          <CardGroup title="🌧️ Ce qui pèse un peu" group="difficulty" selectedIds={selectedIds} onToggle={toggleSelected} />
          <button className="btn btn-primary btn-sticky" type="button" disabled={selectedIds.length === 0} onClick={() => goTo(3)}>Continuer</button>
        </section>
      )}

      {screen === 3 && (
        <section className="screen">
          <Header back={() => goTo(2)} step={2} />
          <h2 className="screen-title">Parmi tes cartes, choisis les 3 plus importantes aujourd’hui.</h2>
          <p className="priority-counter">{priorityIds.length} / 3 priorités choisies</p>
          <div className="card-grid">{selectedCards.map((card) => <CardButton key={card.id} card={card} selected={priorityIds.includes(card.id)} priority={priorityIds.includes(card.id)} onClick={() => togglePriority(card.id)} />)}</div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={priorityIds.length === 0} onClick={() => goTo(4)}>Créer mon EchoMood</button>
        </section>
      )}

      {screen === 4 && (
        <section className="screen">
          <Header back={() => goTo(3)} step={3} />
          <h2 className="screen-title">Quelle est la météo de ton traitement aujourd’hui ?</h2>
          <div className="weather-grid">{weatherOptions.map((option) => <button key={option.id} className={`weather-btn ${weather?.id === option.id ? 'selected' : ''}`} type="button" onClick={() => setWeather(option)}><span className="weather-emoji">{option.emoji}</span><span className="weather-label">{option.label}</span></button>)}</div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={!weather} onClick={showSummary}>Générer la synthèse</button>
        </section>
      )}

      {screen === 5 && summary && (
        <section className="screen">
          <SummaryCard refEl={resultRef} entry={summary} selectedCards={selectedCards} priorityCards={priorityCards} />
          <div className="result-actions">
            <button className="btn btn-secondary" type="button" onClick={copySynthesis}>📋 Copier la synthèse</button>
            <button className="btn btn-secondary" type="button" onClick={() => downloadPng(resultRef.current, 'echomood-synthese.png')}>🖼️ Partager en PNG</button>
            <button className="btn btn-secondary" type="button" onClick={() => downloadXml(createSummaryXml(summary), 'echomood-synthese.xml')}>🧾 Partager en XML</button>
            <button className="btn btn-secondary" type="button" onClick={() => goTo(6)}>📈 Voir l’évolution</button>
            <button className="btn btn-ghost" type="button" onClick={reset}>🔄 Recommencer</button>
          </div>
        </section>
      )}

      {screen === 6 && (
        <section className="screen">
          <div className="screen-header"><button className="btn-back" type="button" onClick={() => goTo(1)} aria-label="Retour">←</button><h2 className="screen-title no-margin">Historique EchoMood</h2></div>
          <HistoryDashboard refEl={historyRef} entries={history} />
          <div className="result-actions">
            <button className="btn btn-secondary" type="button" disabled={history.length === 0} onClick={() => downloadPng(historyRef.current, 'echomood-evolution.png')}>🖼️ Partager l’évolution en PNG</button>
            <button className="btn btn-secondary" type="button" disabled={history.length === 0} onClick={() => downloadXml(createHistoryXml(history), 'echomood-evolution.xml')}>🧾 Partager l’évolution en XML</button>
            <button className="btn btn-primary" type="button" onClick={() => goTo(2)}>Nouvel EchoMood</button>
          </div>
        </section>
      )}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </main>
  )
}

function Header({ back, step }: { back: () => void; step: number }) {
  return <div className="screen-header"><button className="btn-back" type="button" onClick={back} aria-label="Retour">←</button><Progress step={step} /></div>
}

function CardGroup({ title, group, selectedIds, onToggle }: { title: string; group: 'resource' | 'difficulty'; selectedIds: string[]; onToggle: (id: string) => void }) {
  return <section className="card-group"><h3 className="card-group-title">{title}</h3><div className="card-grid">{cards.filter((card) => card.group === group).map((card) => <CardButton key={card.id} card={card} selected={selectedIds.includes(card.id)} onClick={() => onToggle(card.id)} />)}</div></section>
}

function getEchoMoji(priorities: typeof cards) {
  const resources = priorities.filter((card) => card.group === 'resource').length
  return resources >= priorities.length - resources ? '😁' : '🦷'
}

function SummaryCard({ refEl, entry, selectedCards, priorityCards }: { refEl: RefObject<HTMLDivElement | null>; entry: EchoMoodEntry; selectedCards: typeof cards; priorityCards: typeof cards }) {
  const echoMoji = getEchoMoji(priorityCards)

  return <div ref={refEl} className="result-capture result-reveal"><div className="reveal-stage" aria-label={`Révélation de l'EchoMoji ${echoMoji}`}><div className="reveal-halo" /><span className="reveal-emoji">{echoMoji}</span><span className="spark spark-one">✦</span><span className="spark spark-two">•°</span><span className="spark spark-three">✧</span><span className="spark spark-four">✺</span></div><h2 className="result-title">Mon EchoMood Ortho</h2><p className="result-date">{new Date(`${entry.date}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p><div className="weather-display"><span className="we">{entry.weather.emoji}</span><span>{entry.weather.label}</span></div><div className="constellation-wrap"><Constellation selected={selectedCards} priorities={priorityCards} /></div><ResultSection title="🌟 Ressources" cards={selectedCards.filter((card) => card.group === 'resource')} /><ResultSection title="🌧️ Difficultés" cards={selectedCards.filter((card) => card.group === 'difficulty')} /><ResultSection title="🎯 Priorités du jour" cards={priorityCards} priority /><article className="result-section synthesis-box"><h3>📝 Synthèse pour le praticien</h3><p>{entry.synthesis}</p></article><article className="result-section question-box"><h3>💬 Question d’ouverture suggérée</h3><p>{entry.suggestedQuestion}</p></article></div>
}

function HistoryDashboard({ refEl, entries }: { refEl: RefObject<HTMLDivElement | null>; entries: EchoMoodEntry[] }) {
  const latest = entries.at(-1)
  const resourceCount = entries.flatMap((entry) => entry.priorities).filter((card) => card.group === 'resource').length
  const difficultyCount = entries.flatMap((entry) => entry.priorities).filter((card) => card.group === 'difficulty').length
  const maxScore = Math.max(...entries.map((entry) => entry.weatherScore), 1)
  return <div ref={refEl} className="result-capture history-capture"><p className="history-kicker">Dashboard synthétique local</p><h2 className="result-title">Évolution de l’EchoMood</h2>{entries.length === 0 ? <p className="empty-history">Aucune synthèse enregistrée pour le moment. Crée un EchoMood pour alimenter l’historique local.</p> : <><div className="stats-grid"><div><strong>{entries.length}</strong><span>mesures</span></div><div><strong>{latest?.weather.emoji}</strong><span>dernière météo</span></div><div><strong>{resourceCount}</strong><span>priorités ressources</span></div><div><strong>{difficultyCount}</strong><span>priorités difficiles</span></div></div><div className="timeline-chart" aria-label="Évolution de la météo EchoMood">{entries.map((entry) => <div className="chart-item" key={entry.id}><span className="chart-bar" style={{ height: `${Math.max(18, (entry.weatherScore / maxScore) * 120)}px` }}><span>{entry.weather.emoji}</span></span><small>{new Date(`${entry.date}T00:00:00`).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</small></div>)}</div><div className="history-list">{entries.slice().reverse().map((entry) => <article key={entry.id} className="history-entry"><div><strong>{entry.weather.emoji} {entry.weather.label}</strong><small>{new Date(entry.createdAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</small></div><p>{entry.priorities.map((card) => `${card.emoji} ${card.label}`).join(' • ')}</p></article>)}</div></>}</div>
}

function ResultSection({ title, cards: items, priority = false }: { title: string; cards: typeof cards; priority?: boolean }) {
  return <section className="result-section"><h3>{title}</h3><div className="chip-row">{items.length ? items.map((card) => <span className={`chip ${priority ? 'priority-chip' : ''}`} key={card.id}>{card.emoji} {card.label}</span>) : <span className="chip empty">Aucune carte sélectionnée</span>}</div></section>
}

export default App

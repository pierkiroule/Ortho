import { useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { QRCodeSVG } from 'qrcode.react'
import { CardButton } from './components/CardButton'
import { Constellation } from './components/Constellation'
import { Progress } from './components/Progress'
import { cards, weatherOptions } from './data/echomood'
import { createQrDataUrl } from './lib/qrPayload'
import { createSummary } from './lib/synthesis'
import type { WeatherOption } from './types/domain'
import './styles/app.css'

const maxPriorities = 3

function App() {
  const [screen, setScreen] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [priorityIds, setPriorityIds] = useState<string[]>([])
  const [weather, setWeather] = useState<WeatherOption | null>(null)
  const [toast, setToast] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  const selectedCards = useMemo(() => cards.filter((card) => selectedIds.includes(card.id)), [selectedIds])
  const priorityCards = useMemo(() => cards.filter((card) => priorityIds.includes(card.id)), [priorityIds])
  const summary = weather ? createSummary(selectedCards, priorityCards, weather) : null
  const qrUrl = summary ? createQrDataUrl(summary) : ''

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function goTo(next: number) {
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

  async function copySynthesis() {
    if (!summary) return
    await navigator.clipboard.writeText(`${summary.synthesis}\n\nQuestion d’ouverture suggérée : ${summary.suggestedQuestion}`)
    notify('Synthèse copiée !')
  }

  async function downloadCapture() {
    if (!resultRef.current) return
    notify('Préparation de l’image…')
    const dataUrl = await toPng(resultRef.current, { backgroundColor: '#1a1340', pixelRatio: 2 })
    const link = document.createElement('a')
    link.download = 'echomood-ortho.png'
    link.href = dataUrl
    link.click()
  }

  function reset() {
    setSelectedIds([])
    setPriorityIds([])
    setWeather(null)
    goTo(1)
  }

  return (
    <main className="app">
      {screen === 1 && (
        <section className="screen home-screen">
          <div className="hero">
            <div className="hero-orbit" aria-hidden="true"><span>😁</span><span>✨</span><span>🦷</span><span>💪</span></div>
            <span className="hero-badge">✨ Ta constellation du jour</span>
            <h1 className="hero-title">EchoMood<span className="hero-title-accent">Ortho</span></h1>
            <p className="hero-tagline">l’écho de ton vécu par rapport aux soins du moment <span className="tagline-mark">•°</span></p>
            <p className="hero-subtitle">Comment se vit ton traitement en ce moment ?</p>
            <p className="hero-text">Une webapp locale, sans serveur, pour créer en moins d’une minute une synthèse visuelle à montrer à ton orthodontiste.</p>
            <button className="btn btn-primary" type="button" onClick={() => goTo(2)}>Commencer mon EchoMood</button>
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
          <div className="card-grid">
            {selectedCards.map((card) => (
              <CardButton key={card.id} card={card} selected={priorityIds.includes(card.id)} priority={priorityIds.includes(card.id)} onClick={() => togglePriority(card.id)} />
            ))}
          </div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={priorityIds.length === 0} onClick={() => goTo(4)}>Créer mon EchoMood</button>
        </section>
      )}

      {screen === 4 && (
        <section className="screen">
          <Header back={() => goTo(3)} step={3} />
          <h2 className="screen-title">Quelle est la météo de ton traitement aujourd’hui ?</h2>
          <div className="weather-grid">
            {weatherOptions.map((option) => (
              <button key={option.id} className={`weather-btn ${weather?.id === option.id ? 'selected' : ''}`} type="button" onClick={() => setWeather(option)}>
                <span className="weather-emoji">{option.emoji}</span><span className="weather-label">{option.label}</span>
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={!weather} onClick={() => goTo(5)}>Générer la synthèse</button>
        </section>
      )}

      {screen === 5 && summary && (
        <section className="screen">
          <div ref={resultRef} className="result-capture">
            <h2 className="result-title">Mon EchoMood Ortho</h2>
            <p className="result-date">{new Date(`${summary.date}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <div className="weather-display"><span className="we">{summary.weather.emoji}</span><span>{summary.weather.label}</span></div>
            <div className="constellation-wrap"><Constellation selected={selectedCards} priorities={priorityCards} /></div>
            <ResultSection title="🌟 Ressources" cards={selectedCards.filter((card) => card.group === 'resource')} />
            <ResultSection title="🌧️ Difficultés" cards={selectedCards.filter((card) => card.group === 'difficulty')} />
            <ResultSection title="🎯 Priorités du jour" cards={priorityCards} priority />
            <article className="result-section synthesis-box"><h3>📝 Synthèse pour le praticien</h3><p>{summary.synthesis}</p></article>
            <article className="result-section question-box"><h3>💬 Question d’ouverture suggérée</h3><p>{summary.suggestedQuestion}</p></article>
            <div className="qr-section">
              <div className="qrcode"><QRCodeSVG value={qrUrl} size={168} bgColor="#ffffff" fgColor="#1b1438" level="L" /></div>
              <p className="qr-caption">Scanne : la page de synthèse est entièrement contenue dans le QR code.</p>
            </div>
          </div>
          <div className="result-actions">
            <button className="btn btn-secondary" type="button" onClick={copySynthesis}>📋 Copier la synthèse</button>
            <button className="btn btn-secondary" type="button" onClick={downloadCapture}>⬇️ Télécharger la synthèse</button>
            <button className="btn btn-ghost" type="button" onClick={reset}>🔄 Recommencer</button>
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

function ResultSection({ title, cards: items, priority = false }: { title: string; cards: typeof cards; priority?: boolean }) {
  return <section className="result-section"><h3>{title}</h3><div className="chip-row">{items.length ? items.map((card) => <span className={`chip ${priority ? 'priority-chip' : ''}`} key={card.id}>{card.emoji} {card.label}</span>) : <span className="chip empty">Aucune carte sélectionnée</span>}</div></section>
}

export default App

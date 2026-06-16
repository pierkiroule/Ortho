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
import type { EchoMoodEntry, Perspective, WeatherOption } from './types/domain'
import './styles/app.css'

const maxPriorities = 3
type Screen = 0 | 1 | 2 | 3 | 4 | 5 | 6

type Draft = { selectedIds: string[]; priorityIds: string[]; weather: WeatherOption | null; impactScore: number | null }
const emptyDraft = (): Draft => ({ selectedIds: [], priorityIds: [], weather: null, impactScore: null })
const modeLabel: Record<Perspective, string> = { patient: 'Patient', parent: 'Parents' }

function App() {
  const [screen, setScreen] = useState<Screen>(0)
  const [mode, setMode] = useState<Perspective>('patient')
  const [drafts, setDrafts] = useState<Record<Perspective, Draft>>({ patient: emptyDraft(), parent: emptyDraft() })
  const [toast, setToast] = useState('')
  const [history, setHistory] = useState<EchoMoodEntry[]>([])
  const [savedEntry, setSavedEntry] = useState<EchoMoodEntry | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)
  const reportRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => setHistory(loadHistory()), [])

  const draft = drafts[mode]
  const selectedCards = useMemo(() => cards.filter((card) => draft.selectedIds.includes(card.id)), [draft.selectedIds])
  const priorityCards = useMemo(() => cards.filter((card) => draft.priorityIds.includes(card.id)), [draft.priorityIds])
  const summary = savedEntry ?? (draft.weather ? createSummary(selectedCards, priorityCards, draft.weather, mode, draft.impactScore) : null)
  const selectedIds = draft.selectedIds
  const priorityIds = draft.priorityIds
  const weather = draft.weather
  const latestPatient = [...history].reverse().find((entry) => entry.perspective === 'patient')
  const latestParent = [...history].reverse().find((entry) => entry.perspective === 'parent')

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2200) }
  function updateDraft(next: Partial<Draft>) { setDrafts((current) => ({ ...current, [mode]: { ...current[mode], ...next } })) }
  function goTo(next: Screen) { setScreen(next); window.scrollTo({ top: 0, behavior: 'instant' }) }
  function startPatientEchoMood() { setMode('patient'); setSavedEntry(null); goTo(1) }
  function inviteParentsEchoMood() { setMode('parent'); setSavedEntry(null); setDrafts((current) => ({ ...current, parent: emptyDraft() })); goTo(1) }

  function onTouchStart(event: React.TouchEvent<HTMLElement>) { touchStartX.current = event.touches[0].clientX }
  function onTouchEnd(event: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - event.changedTouches[0].clientX
    touchStartX.current = null
    if (Math.abs(delta) < 70) return
    const next = delta > 0 ? Math.min(6, screen + 1) : Math.max(0, screen - 1)
    if (next === 2 && !draft.weather) return notify('Choisis la météo de ton humeur globale avant de continuer')
    if (next === 3 && draft.impactScore === null) return notify('Indique l’impact du soin ortho sur ton mood')
    if (next === 4 && draft.selectedIds.length === 0) return notify('Choisis au moins une carte dans la balance')
    if (next === 5 && draft.priorityIds.length === 0) return notify('Choisis au moins une priorité')
    goTo(next as Screen)
  }

  function toggleSelected(id: string) {
    const next = draft.selectedIds.includes(id) ? draft.selectedIds.filter((item) => item !== id) : [...draft.selectedIds, id]
    updateDraft({ selectedIds: next, priorityIds: draft.priorityIds.filter((priority) => next.includes(priority)) })
  }

  function togglePriority(id: string) {
    if (draft.priorityIds.includes(id)) return updateDraft({ priorityIds: draft.priorityIds.filter((item) => item !== id) })
    if (draft.priorityIds.length >= maxPriorities) return notify('Tu peux choisir 3 priorités maximum')
    updateDraft({ priorityIds: [...draft.priorityIds, id] })
  }

  function showSummary() {
    if (!draft.weather) return
    const entry = createSummary(selectedCards, priorityCards, draft.weather, mode, draft.impactScore)
    setSavedEntry(entry)
    setHistory(upsertEntry(entry))
    goTo(5)
  }

  async function copySynthesis() {
    if (!summary) return
    await navigator.clipboard.writeText(`${summary.synthesis}\n\nAstuces personnalisées :\n${summary.tip ? `- ${summary.tip.title} : ${summary.tip.text}` : '- Aucune astuce ciblée'}\n\nQuestion d’ouverture suggérée : ${summary.suggestedQuestion}`)
    notify('Synthèse copiée !')
  }

  async function downloadPng(target: HTMLDivElement | null, filename: string) {
    if (!target) return
    notify('Préparation de l’image…')
    const dataUrl = await toPng(target, { backgroundColor: '#08142d', pixelRatio: 2 })
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
    link.click(); URL.revokeObjectURL(link.href); notify('Fichier XML prêt à partager')
  }

  function printPdfReport() { notify('Choisis “Enregistrer en PDF” dans la fenêtre d’impression'); window.print() }
  function reset() { setDrafts((current) => ({ ...current, [mode]: emptyDraft() })); setSavedEntry(null); goTo(0) }
  function setWeather(weather: WeatherOption) { updateDraft({ weather }) }

  return (
    <main className={`app screen-${screen}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <EffervescentBubbles variant="ambient" />
      {screen === 0 && <Home onStart={startPatientEchoMood} onHistory={() => goTo(6)} />}

      {screen === 1 && (
        <section className="screen">
          <Header back={() => goTo(0)} step={1} />
          <StepIntro title="Quelle est la météo du traitement aujourd’hui ?" text="Cette météo aide à contextualiser les astuces éducatives et la discussion avec le praticien." mode={mode} />
          <div className="weather-grid weather-first">{weatherOptions.map((option) => <button key={option.id} className={`weather-btn ${weather?.id === option.id ? 'selected' : ''}`} type="button" onClick={() => setWeather(option)}><span className="weather-emoji">{option.emoji}</span><span className="weather-label">{option.label}</span></button>)}</div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={!weather} onClick={() => goTo(2)}>Continuer</button>
        </section>
      )}

      {screen === 2 && (
        <section className="screen">
          <Header back={() => goTo(1)} step={2} />
          <StepIntro title="Quel impact sur le mood ?" text="Le curseur permet de repérer si le vécu orthodontique prend peu ou beaucoup de place aujourd’hui." mode={mode} />
          <ImpactSlider value={draft.impactScore} onChange={(impactScore) => updateDraft({ impactScore })} />
          <button className="btn btn-primary btn-sticky" type="button" disabled={draft.impactScore === null} onClick={() => goTo(3)}>Continuer</button>
        </section>
      )}

      {screen === 3 && (
        <section className="screen">
          <Header back={() => goTo(2)} step={3} />
          <StepIntro title="Choisis ce qui correspond à ton vécu aujourd’hui." text="Les cartes sélectionnées personnaliseront la synthèse et la rubrique Astuces." mode={mode} />
          <CardGroup title="🌟 Ce qui te soutient" group="resource" mode={mode} selectedIds={selectedIds} onToggle={toggleSelected} />
          <CardGroup title="🌧️ Ce qui pèse un peu" group="difficulty" mode={mode} selectedIds={selectedIds} onToggle={toggleSelected} />
          <button className="btn btn-primary btn-sticky" type="button" disabled={selectedIds.length === 0} onClick={() => goTo(4)}>Continuer</button>
        </section>
      )}

      {screen === 4 && (
        <section className="screen">
          <Header back={() => goTo(3)} step={4} />
          <h2 className="screen-title">Parmi tes cartes, choisis les 3 plus importantes aujourd’hui.</h2>
          <p className="priority-counter">{priorityIds.length} / 3 priorités choisies</p>
          <div className="card-grid priority-grid">{selectedCards.map((card) => <CardButton key={card.id} card={card} selected={priorityIds.includes(card.id)} priority={priorityIds.includes(card.id)} onClick={() => togglePriority(card.id)} />)}</div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={priorityIds.length === 0} onClick={showSummary}>Générer la synthèse éducative</button>
        </section>
      )}

      {screen === 5 && summary && (
        <section className="screen">
          <SummaryCard refEl={resultRef} entry={summary} selectedCards={selectedCards} priorityCards={priorityCards} />
          <ShareView reportRef={reportRef} entries={history} patient={latestPatient} parent={latestParent} />
          <div className="result-actions">
            <button className="btn btn-secondary" type="button" onClick={copySynthesis}>📋 Copier la synthèse</button>
            <button className="btn btn-secondary" type="button" onClick={() => downloadPng(resultRef.current, 'echomood-synthese.png')}>🖼️ Partager en PNG</button>
            <button className="btn btn-secondary" type="button" onClick={() => downloadXml(createSummaryXml(summary), 'echomood-synthese.xml')}>🧾 Partager en XML</button>
            <button className="btn btn-secondary" type="button" onClick={() => goTo(6)}>📈 Voir l’évolution</button>
            {summary.perspective === 'patient' && (
              <div className="parent-invite-panel"><p>Tu peux proposer à tes parents de remplir leur EchoMood du moment : cela permettra de comparer si vous percevez la même chose ou pas, tout en gardant le contrôle de ton espace.</p><button className="btn btn-parent-invite" type="button" onClick={inviteParentsEchoMood}>👪 Proposer à mes parents de remplir leur EchoMood</button></div>
            )}
            <button className="btn btn-secondary" type="button" onClick={printPdfReport}>🖨️ Rapport PDF</button>
            <button className="btn btn-ghost" type="button" onClick={reset}>🔄 Recommencer</button>
          </div>
        </section>
      )}

      {screen === 6 && (
        <section className="screen">
          <div className="screen-header"><button className="btn-back" type="button" onClick={() => goTo(1)} aria-label="Retour">←</button><h2 className="screen-title no-margin">Historique EchoMood</h2></div>
          <HistoryDashboard refEl={historyRef} entries={history} patient={latestPatient} parent={latestParent} />
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

function Header({ back, step }: { back: () => void; step: number }) { return <div className="screen-header no-print"><button className="btn-back" type="button" onClick={back} aria-label="Retour">←</button><Progress step={step} /></div> }
function StepIntro({ title, text, mode }: { title: string; text: string; mode: Perspective }) { return <div className="step-card"><span className="mode-pill">Mode {modeLabel[mode]}</span><h2 className="screen-title no-margin">{title}</h2><p>{text}</p></div> }

function Home({ onStart, onHistory }: { onStart: () => void; onHistory: () => void }) { return <section className="screen home-screen"><div className="hero"><EffervescentBubbles variant="hero" /><span className="hero-badge">Swipe horizontal • parcours en 5 étapes</span><h1 className="hero-title" aria-label="EchoMood Ortho"><span className="hero-title-word">EchoMood</span><span className="hero-title-mark">•°</span><span className="hero-title-accent">Ortho</span></h1><p className="hero-subtitle">Un espace éducatif pour t’aider à comprendre ton vécu orthodontique et choisir une astuce adaptée.</p><p className="hero-text">Le parcours démarre avec toi. À la fin, tu pourras décider si tu veux proposer à tes parents de remplir leur EchoMood pour comparer vos perceptions.</p><div className="journey-map"><Progress step={0} /></div><button className="btn btn-primary" type="button" onClick={onStart}>🧑 Commencer mon EchoMood</button><button className="btn btn-secondary" type="button" onClick={onHistory}>📈 Voir synthèse & évolution</button></div></section> }

function ImpactSlider({ value, onChange }: { value: number | null; onChange: (value: number) => void }) {
  const displayValue = value ?? 5
  return <div className="impact-panel"><div className="impact-scale"><span>Très léger</span><strong>{displayValue}/10</strong><span>Très fort</span></div><input className="impact-slider" type="range" min="0" max="10" step="1" value={displayValue} onChange={(event) => onChange(Number(event.currentTarget.value))} aria-label="Impact du soin ortho sur le mood" /><p>{value === null ? 'Déplace le curseur pour noter l’impact.' : `Impact renseigné : ${displayValue}/10`}</p></div>
}

function EffervescentBubbles({ variant }: { variant: 'ambient' | 'hero' | 'reveal' }) { return <div className={`bubble-field bubble-field-${variant}`} aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} className={`bubble bubble-${index + 1}`} />)}</div> }
function CardGroup({ title, group, mode, selectedIds, onToggle }: { title: string; group: 'resource' | 'difficulty'; mode: Perspective; selectedIds: string[]; onToggle: (id: string) => void }) { return <section className="card-group"><h3 className="card-group-title">{title}</h3><div className="card-grid">{cards.filter((card) => card.group === group).map((card) => <CardButton key={card.id} card={{ ...card, label: mode === 'parent' ? card.parentLabel : card.label }} selected={selectedIds.includes(card.id)} onClick={() => onToggle(card.id)} />)}</div></section> }
function getEchoMoji(priorities: typeof cards) { const resources = priorities.filter((card) => card.group === 'resource').length; return resources >= priorities.length - resources ? '😁' : '🦷' }

function SummaryCard({ refEl, entry, selectedCards, priorityCards }: { refEl: RefObject<HTMLDivElement | null>; entry: EchoMoodEntry; selectedCards: typeof cards; priorityCards: typeof cards }) { const echoMoji = getEchoMoji(priorityCards); return <div ref={refEl} className="result-capture result-reveal"><EffervescentBubbles variant="reveal" /><span className="mode-pill">Synthèse {modeLabel[entry.perspective]}</span><div className="reveal-stage" aria-label={`Révélation de l'EchoMoji ${echoMoji}`}><div className="reveal-halo" /><span className="reveal-emoji">{echoMoji}</span></div><h2 className="result-title">EchoMood Ortho</h2><p className="result-date">{new Date(entry.createdAt).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p><div className="weather-display"><span className="we">{entry.weather.emoji}</span><span>{entry.weather.label}</span></div>{entry.impactScore !== null && <div className="impact-summary">Impact ortho sur le mood : <strong>{entry.impactScore}/10</strong></div>}<div className="constellation-wrap"><Constellation selected={selectedCards} priorities={priorityCards} /></div><ResultSection title="🌟 Ressources" cards={selectedCards.filter((card) => card.group === 'resource')} /><ResultSection title="🌧️ Difficultés" cards={selectedCards.filter((card) => card.group === 'difficulty')} /><ResultSection title="🎯 Priorités du jour" cards={priorityCards} priority /><article className="result-section synthesis-box"><h3>📝 Synthèse pour le praticien</h3><p>{entry.synthesis}</p></article><article className="result-section tips-box"><h3>💡 Astuces personnalisées</h3><div className="tips-grid">{entry.tip ? <div className="tip-card" key={entry.tip.id}><strong>{entry.tip.emoji} {entry.tip.title}</strong><p>{entry.tip.text}</p><span>{entry.tip.audience === 'both' ? 'Jeune + parents' : entry.tip.audience === 'parent' ? 'Parents' : 'Jeune'}</span></div> : <p className="empty-history">Aucune astuce ciblée pour cette combinaison.</p>}</div></article><article className="result-section question-box"><h3>💬 Question d’ouverture suggérée</h3><p>{entry.suggestedQuestion}</p></article></div> }

function Comparison({ patient, parent }: { patient?: EchoMoodEntry; parent?: EchoMoodEntry }) { const p = new Set(patient?.priorities.map((c) => c.id) ?? []); const q = new Set(parent?.priorities.map((c) => c.id) ?? []); const convergence = cards.filter((c) => p.has(c.id) && q.has(c.id)); const divergence = cards.filter((c) => p.has(c.id) !== q.has(c.id)); return <div className="comparison"><h3>Convergences / divergences</h3>{!patient || !parent ? <p className="empty-history">Complétez les deux parcours pour visualiser les écarts de perception.</p> : <><ResultSection title="✅ Perceptions partagées" cards={convergence} priority /><ResultSection title="↔️ Points à explorer" cards={divergence} /></>}</div> }

function HistoryDashboard({ refEl, entries, patient, parent }: { refEl: RefObject<HTMLDivElement | null>; entries: EchoMoodEntry[]; patient?: EchoMoodEntry; parent?: EchoMoodEntry }) { const maxScore = Math.max(...entries.map((entry) => entry.weatherScore), 1); return <div ref={refEl} className="result-capture history-capture"><p className="history-kicker">Dashboard local patient + parents</p><h2 className="result-title">Synthèse & évolution</h2><Comparison patient={patient} parent={parent} />{entries.length === 0 ? <p className="empty-history">Aucune synthèse enregistrée pour le moment.</p> : <><div className="stats-grid"><div><strong>{entries.length}</strong><span>mesures</span></div><div><strong>{entries.filter((e) => e.perspective === 'patient').length}</strong><span>patient</span></div><div><strong>{entries.filter((e) => e.perspective === 'parent').length}</strong><span>parents</span></div><div><strong>{patient && parent ? Math.abs(patient.weatherScore - parent.weatherScore) : '—'}</strong><span>écart météo</span></div></div><div className="timeline-chart" aria-label="Évolution de la météo EchoMood">{entries.map((entry) => <div className={`chart-item ${entry.perspective}`} key={entry.id}><span className="chart-bar" style={{ height: `${Math.max(18, (entry.weatherScore / maxScore) * 120)}px` }}><span>{entry.weather.emoji}</span></span><small>{modeLabel[entry.perspective]}</small><small>{new Date(entry.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</small></div>)}</div><div className="history-list">{entries.slice().reverse().map((entry) => <article key={entry.id} className="history-entry"><div><strong>{entry.weather.emoji} {modeLabel[entry.perspective]} · {entry.weather.label}</strong><small>{new Date(entry.createdAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</small></div><p>{entry.priorities.map((card) => `${card.emoji} ${card.label}`).join(' • ')}</p></article>)}</div></>}</div> }

function ShareView({ reportRef, entries, patient, parent }: { reportRef: RefObject<HTMLDivElement | null>; entries: EchoMoodEntry[]; patient?: EchoMoodEntry; parent?: EchoMoodEntry }) { return <div ref={reportRef} className="result-capture report-capture"><p className="history-kicker">Rapport PDF horodaté</p><h2 className="result-title">Rapport EchoMood Ortho</h2><p className="result-date">Généré le {new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p><Comparison patient={patient} parent={parent} />{[patient, parent].filter(Boolean).map((entry) => <article className="report-panel" key={entry!.id}><h3>{modeLabel[entry!.perspective]} · {entry!.weather.emoji} {entry!.weather.label}</h3><p>{entry!.synthesis}</p>{entry!.tip && <p className="tip-report"><strong>{entry!.tip.title}.</strong> {entry!.tip.text}</p>}{entry!.impactScore !== null && <p className="impact-report">Impact : {entry!.impactScore}/10</p>}<ResultSection title="Priorités" cards={entry!.priorities} priority /></article>)}<p className="report-footnote">Historique inclus : {entries.length} mesure(s) enregistrée(s) localement sur cet appareil.</p></div> }

function ResultSection({ title, cards: items, priority = false }: { title: string; cards: typeof cards; priority?: boolean }) { return <section className="result-section"><h3>{title}</h3><div className="chip-row">{items.length ? items.map((card) => <span className={`chip ${priority ? 'priority-chip' : ''}`} key={card.id}>{card.emoji} {card.label}</span>) : <span className="chip empty">Aucune carte sélectionnée</span>}</div></section> }

export default App

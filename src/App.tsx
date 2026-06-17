import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { toPng } from 'html-to-image'
import { CardButton } from './components/CardButton'
import { EchoMoodRosace } from './components/EchoMoodRosace'
import { EchoMoodTimelineRosace } from './components/EchoMoodTimelineRosace'
import { Progress } from './components/Progress'
import { cards, treatmentOptions, weatherOptions } from './data/echomood'
import { loadHistory, upsertEntry } from './lib/history'
import { createSummary, toCompactEchoMood } from './lib/synthesis'
import { createHistoryXml } from './lib/xmlExport'
import { encodeEchoMood } from './lib/echoMoodCodec'
import type { EchoMoodEntry, Perspective, TreatmentOption, WeatherOption } from './types/domain'
import './styles/app.css'

type Screen = 0 | 1 | 2 | 3 | 4 | 5 | 6

type Draft = { selectedIds: string[]; priorityIds: string[]; weather: WeatherOption | null; treatmentWeight: TreatmentOption | null }
const emptyDraft = (): Draft => ({ selectedIds: [], priorityIds: [], weather: null, treatmentWeight: null })
const modeLabel: Record<Perspective, string> = { patient: 'Jeune', parent: 'Parent' }

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
  const cardsForMode = useMemo(() => cards.map((card) => ({ ...card, label: mode === 'parent' ? card.parentLabel : card.label })), [mode])
  const selectedCards = useMemo(() => cardsForMode.filter((card) => draft.selectedIds.includes(card.id)), [cardsForMode, draft.selectedIds])
  const priorityCards = useMemo(() => cardsForMode.filter((card) => draft.priorityIds.includes(card.id)), [cardsForMode, draft.priorityIds])
  const summary = savedEntry ?? (draft.weather ? createSummary(selectedCards, priorityCards, draft.weather, mode, null, draft.treatmentWeight) : null)
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
    if (next === 2 && !draft.weather) return notify('Choisis une météo avant de continuer')
    if (next === 3 && !draft.treatmentWeight) return notify('Choisis la place du traitement')
    if (next === 4 && draft.selectedIds.length === 0) return notify('Choisis au moins une carte')
    if (next === 5 && draft.priorityIds.length === 0) return notify('Choisis ta carte du jour')
    goTo(next as Screen)
  }

  function toggleSelected(id: string) {
    const next = draft.selectedIds.includes(id) ? draft.selectedIds.filter((item) => item !== id) : [...draft.selectedIds, id]
    updateDraft({ selectedIds: next, priorityIds: draft.priorityIds.filter((priority) => next.includes(priority)) })
  }

  function chooseDailyCard(id: string) { updateDraft({ priorityIds: [id] }) }

  function showSummary() {
    if (!draft.weather) return
    const entry = createSummary(selectedCards, priorityCards, draft.weather, mode, null, draft.treatmentWeight)
    setSavedEntry(entry)
    setHistory(upsertEntry(entry))
    goTo(5)
  }

  function copyEchoMoodCode() {
    if (!summary) return
    const compact = summary.echoMood ?? toCompactEchoMood(summary)
    navigator.clipboard.writeText(encodeEchoMood(compact))
    notify('Code EchoMood copié')
  }

  function shareSynthesisByEmail() {
    if (!summary) return
    const subject = 'Synthèse EchoMood pour mon orthodontiste'
    const body = [
      'Bonjour,',
      '',
      'Voici ma synthèse EchoMood à partager avec mon orthodontiste :',
      '',
      summary.synthesis,
      '',
      `Question d’ouverture : ${summary.suggestedQuestion}`,
      '',
      `Date : ${new Date(summary.createdAt).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}`,
    ].join('\n')
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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
  function setTreatmentWeight(treatmentWeight: TreatmentOption) { updateDraft({ treatmentWeight }) }

  return (
    <main className={`app screen-${screen}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <EffervescentBubbles variant="ambient" />
      {screen === 0 && <Home onStart={startPatientEchoMood} onHistory={() => goTo(6)} />}

      {screen === 1 && (
        <section className="screen">
          <Header back={() => goTo(0)} step={1} />
          <StepIntro
            title={mode === 'parent' ? 'Selon vous, si son humeur du moment était une météo, quel émoji choisiriez-vous ?' : 'Si ton humeur du moment était une météo, quel émoji choisirais-tu ?'}
            text={mode === 'parent' ? 'Choisissez l’image qui ressemble le plus à ce qu’il vit en ce moment.' : 'Choisis l’image qui ressemble le plus à ce que tu vis en ce moment.'}
            mode={mode}
          />
          <div className="weather-grid weather-first">{weatherOptions.map((option) => <button key={option.id} className={`weather-btn ${weather?.id === option.id ? 'selected' : ''}`} type="button" onClick={() => setWeather(option)}><span className="weather-emoji">{option.emoji}</span><span className="weather-label">{option.label}</span><small>{mode === 'parent' ? option.parentDescription : option.description}</small></button>)}</div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={!weather} onClick={() => goTo(2)}>Continuer</button>
        </section>
      )}

      {screen === 2 && (
        <section className="screen">
          <Header back={() => goTo(1)} step={2} />
          <StepIntro
            title={mode === 'parent' ? 'Selon vous, aujourd’hui, comment vit-il son traitement orthodontique ?' : 'Aujourd’hui, comment vis-tu ton traitement orthodontique ?'}
            text={mode === 'parent' ? 'Choisissez l’image qui décrit le mieux son ressenti au quotidien face aux contraintes du traitement : bagues, élastiques, consignes…' : 'Choisis l’image qui décrit le mieux ton ressenti au quotidien face aux contraintes du traitement : bagues, élastiques, consignes…'}
            mode={mode}
          />
          <div className="weather-grid treatment-grid">{treatmentOptions.map((option) => <button key={option.id} className={`weather-btn ${draft.treatmentWeight?.id === option.id ? 'selected' : ''}`} type="button" onClick={() => setTreatmentWeight(option)}><span className="weather-emoji">{option.emoji}</span><span className="weather-label">{option.label}</span><small>{mode === 'parent' ? option.parentDescription : option.description}</small></button>)}</div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={!draft.treatmentWeight} onClick={() => goTo(3)}>Continuer</button>
        </section>
      )}

      {screen === 3 && (
        <section className="screen">
          <Header back={() => goTo(2)} step={3} />
          <StepIntro
            title={mode === 'parent' ? 'Qu’est-ce qui ressemble le plus à ce qu’il vit actuellement ?' : 'Qu’est-ce qui ressemble le plus à ce que tu vis actuellement ?'}
            text={mode === 'parent' ? 'Vous pouvez choisir autant de cartes que vous le souhaitez.' : 'Tu peux choisir autant de cartes que tu veux.'}
            mode={mode}
          />
          <CardGroup title={mode === 'parent' ? '🌟 Ce qui semble le soutenir' : '🌟 Ce qui me soutient'} group="resource" mode={mode} selectedIds={selectedIds} onToggle={toggleSelected} />
          <CardGroup title={mode === 'parent' ? '🌧️ Ce qui semble lui peser' : '🌧️ Ce qui me pèse'} group="difficulty" mode={mode} selectedIds={selectedIds} onToggle={toggleSelected} />
          <button className="btn btn-primary btn-sticky" type="button" disabled={selectedIds.length === 0} onClick={() => goTo(4)}>Continuer</button>
        </section>
      )}

      {screen === 4 && (
        <section className="screen">
          <Header back={() => goTo(3)} step={4} />
          <StepIntro
            title={mode === 'parent' ? 'Si vous ne pouviez garder qu’une seule carte, laquelle choisiriez-vous ?' : 'Si tu ne pouvais garder qu’une seule carte, laquelle choisirais-tu ?'}
            text={mode === 'parent' ? 'Celle qui représente le mieux ce qu’il vit aujourd’hui.' : 'Celle qui représente le mieux ce que tu vis aujourd’hui.'}
            mode={mode}
          />
          <div className="card-grid priority-grid">{selectedCards.map((card) => <CardButton key={card.id} card={card} selected={priorityIds.includes(card.id)} priority={priorityIds.includes(card.id)} onClick={() => chooseDailyCard(card.id)} />)}</div>
          <button className="btn btn-primary btn-sticky" type="button" disabled={priorityIds.length === 0} onClick={showSummary}>{mode === 'parent' ? 'Créer l’EchoMood Parent' : 'Créer mon EchoMood'}</button>
        </section>
      )}

      {screen === 5 && summary && (
        <section className="screen">
          <SummaryCard refEl={resultRef} entry={summary} />
          <ShareView reportRef={reportRef} entries={history} patient={latestPatient} parent={latestParent} />
          <div className="result-actions">
            <button className="btn btn-secondary" type="button" onClick={copyEchoMoodCode}>📋 Copier</button><button className="btn btn-secondary" type="button" onClick={() => downloadPng(resultRef.current, 'echomood-rosace.png')}>🖼️ Télécharger image/PDF</button><button className="btn btn-secondary" type="button" onClick={shareSynthesisByEmail}>✉️ Partager cette synthèse pour mon orthodontiste</button>
            <button className="btn btn-secondary" type="button" onClick={printPdfReport}>🖨️ Imprimer cette synthèse pour mon orthodontiste</button>
            <button className="btn btn-secondary" type="button" onClick={() => goTo(6)}>📈 Voir l’évolution</button>
            {summary.perspective === 'patient' && (
              <div className="parent-invite-panel"><p>Tu peux proposer à tes parents de remplir leur EchoMood du moment : cela permettra de comparer si vous percevez la même chose ou pas, tout en gardant le contrôle de ton espace.</p><button className="btn btn-parent-invite" type="button" onClick={inviteParentsEchoMood}>👪 Proposer à mes parents de remplir leur EchoMood</button></div>
            )}
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
            <button className="btn btn-primary" type="button" onClick={() => goTo(1)}>Nouvel EchoMood</button>
          </div>
        </section>
      )}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </main>
  )
}

function Header({ back, step }: { back: () => void; step: number }) { return <div className="screen-header no-print"><button className="btn-back" type="button" onClick={back} aria-label="Retour">←</button><Progress step={step} /></div> }
function StepIntro({ title, text, mode }: { title: string; text: string; mode: Perspective }) { return <div className="step-card"><span className="mode-pill">Mode {modeLabel[mode]}</span><h2 className="screen-title no-margin">{title}</h2><p>{text}</p></div> }

function Home({ onStart, onHistory }: { onStart: () => void; onHistory: () => void }) {
  return <section className="screen home-screen"><div className="hero hero-simple"><EffervescentBubbles variant="hero" /><h1 className="hero-title" aria-label="EchoMood. Comment vis-tu le soin orthodontique actuellement ?"><span className="hero-title-word">EchoMood</span><span className="hero-title-question">Comment vis-tu le soin orthodontique actuellement&nbsp;?</span></h1><div className="professional-card" aria-label="Informations du professionnel"><span className="professional-card-label">Professionnel référent</span><p>Nom du Docteur, coordonnées.</p></div><button className="btn btn-primary" type="button" onClick={onStart}>🧑 Commencer mon EchoMood</button><button className="btn btn-secondary" type="button" onClick={onHistory}>📈 Voir synthèse & évolution</button></div></section>
}

function EffervescentBubbles({ variant }: { variant: 'ambient' | 'hero' | 'reveal' }) { return <div className={`bubble-field bubble-field-${variant}`} aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} className={`bubble bubble-${index + 1}`} />)}</div> }
function CardGroup({ title, group, mode, selectedIds, onToggle }: { title: string; group: 'resource' | 'difficulty'; mode: Perspective; selectedIds: string[]; onToggle: (id: string) => void }) { return <section className="card-group"><h3 className="card-group-title">{title}</h3><div className="card-grid">{cards.filter((card) => card.group === group).map((card) => <CardButton key={card.id} card={{ ...card, label: mode === 'parent' ? card.parentLabel : card.label }} selected={selectedIds.includes(card.id)} onClick={() => onToggle(card.id)} />)}</div></section> }
function SummaryCard({ refEl, entry }: { refEl: RefObject<HTMLDivElement | null>; entry: EchoMoodEntry }) {
  const isParent = entry.perspective === 'parent'
  const compact = entry.echoMood ?? toCompactEchoMood(entry)
  return <div ref={refEl} className="result-capture resonance-summary"><span className="mode-pill">{isParent ? 'Mode Parent' : 'Mode Jeune'}</span><h2 className="result-title">{isParent ? 'Voici l’EchoMood Parent' : 'Voici ton EchoMood aujourd’hui'}</h2><p className="result-date">{new Date(entry.createdAt).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p><article className="result-section rosace-main-card"><EchoMoodRosace echoMood={compact} variant="single" showLegend animated={false} /></article><article className="result-section question-box"><h3>💬 Question d’ouverture</h3><p>{entry.suggestedQuestion}</p></article></div>
}

function Comparison({ patient, parent }: { patient?: EchoMoodEntry; parent?: EchoMoodEntry }) {
  const patientIds = new Set(patient?.selected.map((c) => c.id) ?? [])
  const parentIds = new Set(parent?.selected.map((c) => c.id) ?? [])
  const shared = cards.filter((c) => patientIds.has(c.id) && parentIds.has(c.id))
  const different = cards.filter((c) => patientIds.has(c.id) !== parentIds.has(c.id))
  return <div className="comparison"><h3>Regards croisés</h3>{!patient || !parent ? <p className="empty-history">Complétez un EchoMood Jeune et un EchoMood Parent pour repérer les écarts de perception.</p> : <><div className="comparison-columns"><article><h4>🧒 EchoMood Jeune</h4><p>{patient.weather.emoji} {patient.weather.label}</p><p>{patient.treatmentWeight ? `${patient.treatmentWeight.emoji} ${patient.treatmentWeight.label}` : '—'}</p><p>{patient.priorities[0] ? `${patient.priorities[0].emoji} ${patient.priorities[0].label}` : '—'}</p></article><article><h4>👨‍👩‍👧 EchoMood Parent</h4><p>{parent.weather.emoji} {parent.weather.label}</p><p>{parent.treatmentWeight ? `${parent.treatmentWeight.emoji} ${parent.treatmentWeight.label}` : '—'}</p><p>{parent.priorities[0] ? `${parent.priorities[0].emoji} ${parent.priorities[0].label}` : '—'}</p></article></div><ResultSection title="✅ Ce qui se rejoint" cards={shared} priority /><ResultSection title="👀 Ce qui semble perçu différemment" cards={different} /><p className="comparison-note">Les deux EchoMood permettent de repérer ce qui est partagé et ce qui mérite d’être exploré ensemble pendant la consultation.</p></>}</div>
}

function HistoryDashboard({ refEl, entries, patient, parent }: { refEl: RefObject<HTMLDivElement | null>; entries: EchoMoodEntry[]; patient?: EchoMoodEntry; parent?: EchoMoodEntry }) { return <div ref={refEl} className="result-capture history-capture"><p className="history-kicker">Dashboard local jeune + parent</p><h2 className="result-title">Synthèse & évolution</h2><Comparison patient={patient} parent={parent} /><EchoMoodTimelineRosace history={entries.map((entry) => entry.echoMood ?? toCompactEchoMood(entry))} />{entries.length === 0 ? <p className="empty-history">Aucune synthèse enregistrée pour le moment.</p> : <><div className="stats-grid"><div><strong>{entries.length}</strong><span>mesures</span></div><div><strong>{entries.filter((e) => e.perspective === 'patient').length}</strong><span>patient</span></div><div><strong>{entries.filter((e) => e.perspective === 'parent').length}</strong><span>parent</span></div><div><strong>{patient && parent ? Math.abs(patient.weatherScore - parent.weatherScore) : '—'}</strong><span>écart météo</span></div></div><div className="history-mandala-grid" aria-label="Historique EchoMood en mandalas">{entries.slice().reverse().map((entry) => <article key={entry.id} className="history-mandala-card"><EchoMoodRosace echoMood={entry.echoMood ?? toCompactEchoMood(entry)} variant="single" animated={false} /><small>{modeLabel[entry.perspective]} · {new Date(entry.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</small></article>)}</div></>}</div> }

function ShareView({ reportRef, entries, patient, parent }: { reportRef: RefObject<HTMLDivElement | null>; entries: EchoMoodEntry[]; patient?: EchoMoodEntry; parent?: EchoMoodEntry }) { return <div ref={reportRef} className="result-capture report-capture"><p className="history-kicker">Rapport PDF horodaté</p><h2 className="result-title">Rapport EchoMood Ortho</h2><p className="result-date">Généré le {new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</p><Comparison patient={patient} parent={parent} />{[patient, parent].filter(Boolean).map((entry) => <article className="report-panel" key={entry!.id}><h3>{modeLabel[entry!.perspective]} · {entry!.weather.emoji} {entry!.weather.label}</h3><p>{entry!.synthesis}</p>{entry!.tip && <p className="tip-report"><strong>{entry!.tip.title}.</strong> {entry!.tip.text}</p>}<ResultSection title="Carte du jour" cards={entry!.priorities} priority /></article>)}<p className="report-footnote">Historique inclus : {entries.length} mesure(s) enregistrée(s) localement sur cet appareil.</p></div> }

function ResultSection({ title, cards: items, priority = false }: { title: string; cards: typeof cards; priority?: boolean }) { return <section className="result-section"><h3>{title}</h3><div className="chip-row">{items.length ? items.map((card) => <span className={`chip ${priority ? 'priority-chip' : ''}`} key={card.id}>{card.emoji} {card.label}</span>) : <span className="chip empty">Aucune carte sélectionnée</span>}</div></section> }

export default App

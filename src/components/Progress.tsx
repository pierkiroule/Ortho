const steps = [
  { icon: '🏠', label: 'Accueil' },
  { icon: '⚖️', label: 'Balance' },
  { icon: '🌦️', label: 'Météo' },
  { icon: '📝', label: 'Synthèse' },
  { icon: '📈', label: 'Évolution' },
  { icon: '📤', label: 'Partager' },
]

type Props = { step: number; total?: number }

export function Progress({ step, total = steps.length }: Props) {
  const visibleSteps = steps.slice(0, total)
  return (
    <nav className="progress-track" aria-label={`Étape ${step} sur ${total}`}>
      {visibleSteps.map((item, index) => {
        const stepNumber = index
        const active = stepNumber === step
        const filled = stepNumber <= step
        return (
          <span key={item.label} className={`progress-step ${filled ? 'filled' : ''} ${active ? 'active' : ''}`} aria-current={active ? 'step' : undefined}>
            <span className="progress-icon" aria-hidden="true">{item.icon}</span>
            <span className="progress-number">{stepNumber}</span>
          </span>
        )
      })}
    </nav>
  )
}

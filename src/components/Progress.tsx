type Props = { step: number; total?: number }

export function Progress({ step, total = 4 }: Props) {
  return (
    <div className="progress-track" aria-label={`Étape ${step} sur ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={`progress-dot ${index < step ? 'filled' : ''}`} />
      ))}
    </div>
  )
}

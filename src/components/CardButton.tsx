import type { MoodCard } from '../types/domain'

type Props = {
  card: MoodCard
  selected: boolean
  priority?: boolean
  onClick: () => void
}

export function CardButton({ card, selected, priority = false, onClick }: Props) {
  return (
    <button
      className={`card is-${card.group} ${selected ? 'selected' : ''} ${priority ? 'priority-mark' : ''}`}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="card-emoji" aria-hidden="true">{card.emoji}</span>
      <span className="card-label">{card.label}</span>
    </button>
  )
}

import type { MoodCard, WeatherOption } from '../types/domain'

type Props = { selected: MoodCard[]; priorities: MoodCard[]; weather?: WeatherOption }

export function Constellation({ selected, priorities, weather }: Props) {
  const priorityIds = new Set(priorities.map((card) => card.id))
  const center = weather?.emoji ?? '🌦️'

  return (
    <div className="constellation" aria-label="Paysage EchoMood des cartes sélectionnées">
      <div className="constellation-center" aria-hidden="true">{center}</div>
      {selected.map((card, index) => {
        const angle = (2 * Math.PI * index) / selected.length - Math.PI / 2
        const x = 50 + 38 * Math.cos(angle)
        const y = 50 + 38 * Math.sin(angle)
        const isPriority = priorityIds.has(card.id)

        return (
          <div className={`constellation-node is-${card.group} ${isPriority ? 'priority' : ''}`} key={card.id} style={{ left: `${x}%`, top: `${y}%` }} title={card.label}>
            <span className="floaty" style={{ animationDelay: `${index * 0.35}s` }}>{card.emoji}</span>
          </div>
        )
      })}
    </div>
  )
}

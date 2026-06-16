import { difficultyPhrase, questions, resourcePhrase } from '../data/echomood'
import type { EchoMoodSummary, MoodCard, WeatherOption } from '../types/domain'

export function joinFrench(items: string[]) {
  if (items.length < 2) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} et ${items.at(-1)}`
}

export function buildSynthesis(priorityCards: MoodCard[]) {
  const resources = priorityCards.filter((card) => card.group === 'resource')
  const difficulties = priorityCards.filter((card) => card.group === 'difficulty')
  const parts: string[] = []

  if (resources.length > 0) {
    parts.push(
      `Le traitement conserve du sens pour le jeune grâce ${joinFrench(
        resources.map((card) => resourcePhrase[card.id]),
      )}.`,
    )
  }

  if (difficulties.length > 0) {
    parts.push(
      `Les contraintes liées ${joinFrench(
        difficulties.map((card) => difficultyPhrase[card.id]),
      )} occupent actuellement une place importante dans son vécu.`,
    )
  }

  return parts.join(' ')
}

export function createSummary(selected: MoodCard[], priorities: MoodCard[], weather: WeatherOption): EchoMoodSummary {
  const synthesis = buildSynthesis(priorities)

  return {
    date: new Date().toISOString().slice(0, 10),
    weather,
    selected,
    priorities,
    synthesis,
    suggestedQuestion:
      priorities.length > 0
        ? questions[priorities[0].id]
        : 'Qu’est-ce qui te ferait le plus plaisir à partager aujourd’hui ?',
  }
}

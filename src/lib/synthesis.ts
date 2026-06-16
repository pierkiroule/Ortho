import { difficultyPhrase, questions, resourcePhrase } from '../data/echomood'
import { getWeatherScore } from './history'
import type { EchoMoodSummary, MoodCard, Perspective, WeatherOption } from '../types/domain'

export function joinFrench(items: string[]) {
  if (items.length < 2) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} et ${items.at(-1)}`
}

export function buildSynthesis(priorityCards: MoodCard[], perspective: Perspective = 'patient') {
  const resources = priorityCards.filter((card) => card.group === 'resource')
  const difficulties = priorityCards.filter((card) => card.group === 'difficulty')
  const parts: string[] = []

  if (resources.length > 0) {
    parts.push(
      `${perspective === 'parent' ? 'Du point de vue des parents, le traitement conserve du sens pour le jeune grâce' : 'Le traitement conserve du sens pour le jeune grâce'} ${joinFrench(
        resources.map((card) => resourcePhrase[card.id]),
      )}.`,
    )
  }

  if (difficulties.length > 0) {
    parts.push(
      `${perspective === 'parent' ? 'Les parents perçoivent que les contraintes liées' : 'Les contraintes liées'} ${joinFrench(
        difficulties.map((card) => difficultyPhrase[card.id]),
      )} occupent actuellement une place importante dans son vécu${perspective === 'parent' ? ' observé' : ''}.`,
    )
  }

  return parts.join(' ')
}

export function createSummary(selected: MoodCard[], priorities: MoodCard[], weather: WeatherOption, perspective: Perspective = 'patient'): EchoMoodSummary {
  const synthesis = buildSynthesis(priorities, perspective)

  const createdAt = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    createdAt,
    date: createdAt.slice(0, 10),
    perspective,
    weatherScore: getWeatherScore(weather.id),
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

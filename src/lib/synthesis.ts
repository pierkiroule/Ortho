import { difficultyPhrase, educationalTips, questions, resourcePhrase } from '../data/echomood'
import { getWeatherScore } from './history'
import type { EchoMoodSummary, MoodCard, Perspective, WeatherOption, EducationalTip } from '../types/domain'

export function joinFrench(items: string[]) {
  if (items.length < 2) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} et ${items.at(-1)}`
}

export function buildSynthesis(priorityCards: MoodCard[], perspective: Perspective = 'patient', impactScore: number | null = null) {
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

  if (impactScore !== null) {
    parts.unshift(`Impact perçu du soin ortho sur le mood : ${impactScore}/10.`)
  }

  return parts.join(' ')
}


export function selectEducationalTips(priorityCards: MoodCard[], selectedCards: MoodCard[], weather: WeatherOption, perspective: Perspective, impactScore: number | null): EducationalTip[] {
  const selectedIds = new Set([...selectedCards, ...priorityCards].map((card) => card.id))
  const selectedGroups = new Set([...selectedCards, ...priorityCards].map((card) => card.group))

  return educationalTips
    .map((tip) => {
      let score = tip.audience === 'both' || tip.audience === perspective ? 2 : 0
      if (tip.cardIds?.some((id) => selectedIds.has(id))) score += 5
      if (tip.groups?.some((group) => selectedGroups.has(group))) score += 2
      if (tip.weatherIds?.includes(weather.id)) score += 2
      if (impactScore !== null && tip.minImpactScore !== undefined && impactScore >= tip.minImpactScore) score += 2
      if (impactScore !== null && tip.maxImpactScore !== undefined && impactScore <= tip.maxImpactScore) score += 2
      return { tip, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ tip }) => tip)
}

export function createSummary(selected: MoodCard[], priorities: MoodCard[], weather: WeatherOption, perspective: Perspective = 'patient', impactScore: number | null = null): EchoMoodSummary {
  const synthesis = buildSynthesis(priorities, perspective, impactScore)
  const tips = selectEducationalTips(priorities, selected, weather, perspective, impactScore)

  const createdAt = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    createdAt,
    date: createdAt.slice(0, 10),
    perspective,
    weatherScore: getWeatherScore(weather.id),
    impactScore,
    weather,
    selected,
    priorities,
    synthesis,
    tips,
    suggestedQuestion:
      priorities.length > 0
        ? questions[priorities[0].id]
        : 'Qu’est-ce qui te ferait le plus plaisir à partager aujourd’hui ?',
  }
}

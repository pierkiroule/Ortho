import { cards, questions, treatmentOptions, weatherOptions } from '../data/echomood'
import type { DifficultyCode, ResourceCode, WeatherCode, WeightCode } from './echoMoodCodec'
import type { EchoMood, EchoMoodSummary, MoodCard, Perspective, TreatmentOption, WeatherOption } from '../types/domain'

const legacyWeatherScores = Object.fromEntries(weatherOptions.map((option, index) => [option.id, weatherOptions.length - index])) as Record<string, number>
const getLegacyWeatherScore = (weatherId: string) => legacyWeatherScores[weatherId] ?? 0

const weatherCodeByLegacyId: Record<string, WeatherCode> = { soleil: 'sun', eclaircies: 'clear', variable: 'variable', couvert: 'cloudy', pluie: 'rain', orage: 'storm' }
const weightCodeByLegacyId: Record<string, WeightCode> = { ballon: 'balloon', sac: 'bag', valise: 'suitcase', rocher: 'rock' }
const cardCodeByLegacyId: Record<string, ResourceCode | DifficultyCode> = {
  changements: 'r1', perseverance: 'r2', sens: 'r3', projection: 'r4', soutien: 'r5', fierte: 'r6', habitudes: 'r7', comprehension: 'r8',
  elastiques: 'd1', douleur: 'd2', irritations: 'd3', duree: 'd4', oubli: 'd5', regard: 'd6', manger: 'd7', questions: 'd8',
}

export function toCompactEchoMood(summary: EchoMoodSummary): EchoMood {
  const selectedCodes = summary.selected.map((card) => cardCodeByLegacyId[card.id]).filter(Boolean)
  return {
    id: summary.id.startsWith('emo_') ? summary.id : `emo_${summary.date.replaceAll('-', '')}_${summary.id.slice(0, 8)}`,
    mode: summary.perspective,
    date: summary.date,
    weather: weatherCodeByLegacyId[summary.weather.id] ?? 'variable',
    weight: weightCodeByLegacyId[summary.treatmentWeight?.id ?? ''] ?? 'bag',
    selectedResources: selectedCodes.filter((id) => id.startsWith('r')) as ResourceCode[],
    selectedDifficulties: selectedCodes.filter((id) => id.startsWith('d')) as DifficultyCode[],
    dailyCard: cardCodeByLegacyId[summary.priorities[0]?.id] ?? (selectedCodes[0] as ResourceCode | DifficultyCode) ?? 'r1',
  }
}

function treatmentInterpretation(treatmentWeight: TreatmentOption | null) {
  switch (treatmentWeight?.id) {
    case 'ballon': return 'le traitement semble plutôt en arrière-plan aujourd’hui.'
    case 'sac': return 'le traitement semble présent mais globalement intégré.'
    case 'valise': return 'le traitement prend une place importante en ce moment.'
    case 'rocher': return 'le traitement semble difficile à porter en ce moment.'
    default: return ''
  }
}

export function buildSynthesis(weather: WeatherOption, treatmentWeight: TreatmentOption | null, dailyCard: MoodCard | undefined, perspective: Perspective = 'patient') {
  if (perspective === 'parent') {
    return `Selon le parent, la météo générale de l’enfant est ${weather.emoji} ${weather.label}. Le traitement est perçu comme ${treatmentWeight ? `${treatmentWeight.emoji} ${treatmentWeight.label}` : 'non renseigné'}. La carte du jour perçue est : ${dailyCard ? `${dailyCard.emoji} ${dailyCard.label}` : 'non renseignée'}. Ces éléments ne décrivent pas une vérité objective, mais la manière dont le parent perçoit actuellement le vécu de son enfant.`
  }

  const interpretation = treatmentInterpretation(treatmentWeight)
  return `Aujourd’hui, la météo générale est ${weather.emoji} ${weather.label}. Le traitement est vécu comme ${treatmentWeight ? `${treatmentWeight.emoji} ${treatmentWeight.label}` : 'non renseigné'}. La carte du jour est : ${dailyCard ? `${dailyCard.emoji} ${dailyCard.label}` : 'non renseignée'}. Les cartes sélectionnées montrent ce qui soutient le jeune et ce qui lui pèse actuellement.${interpretation ? ` ${interpretation}` : ''}`
}

export function getOpeningQuestion(dailyCard: MoodCard | undefined, perspective: Perspective) {
  if (!dailyCard) return perspective === 'parent' ? 'Qu’est-ce qui serait important d’aborder aujourd’hui ?' : 'Qu’est-ce qui serait important d’en parler aujourd’hui ?'
  return questions[dailyCard.id]?.[perspective] ?? (perspective === 'parent' ? 'Qu’est-ce qui serait important d’aborder aujourd’hui ?' : 'Qu’est-ce qui serait important d’en parler aujourd’hui ?')
}

export function createSummary(selected: MoodCard[], priorities: MoodCard[], weather: WeatherOption, perspective: Perspective = 'patient', impactScore: number | null = null, treatmentWeight: TreatmentOption | null = null): EchoMoodSummary {
  const dailyCard = priorities[0]
  const createdAt = new Date().toISOString()

  const summary: EchoMoodSummary = {
    id: crypto.randomUUID(),
    createdAt,
    date: createdAt.slice(0, 10),
    perspective,
    weatherScore: getLegacyWeatherScore(weather.id),
    impactScore,
    treatmentWeight,
    weather,
    selected,
    priorities,
    synthesis: buildSynthesis(weather, treatmentWeight, dailyCard, perspective),
    tip: null,
    suggestedQuestion: getOpeningQuestion(dailyCard, perspective),
  }
  summary.echoMood = toCompactEchoMood(summary)
  return summary
}

export function fromCompactEchoMood(echoMood: EchoMood): EchoMoodSummary {
  const weatherLegacyIdByCode: Record<WeatherCode, string> = { sun: 'soleil', clear: 'eclaircies', variable: 'variable', cloudy: 'couvert', rain: 'pluie', storm: 'orage' }
  const weightLegacyIdByCode: Record<WeightCode, string> = { balloon: 'ballon', bag: 'sac', suitcase: 'valise', rock: 'rocher' }
  const legacyByCode = Object.fromEntries(Object.entries(cardCodeByLegacyId).map(([legacy, code]) => [code, legacy]))
  const selectedIds = [...echoMood.selectedResources, ...echoMood.selectedDifficulties].map((code) => legacyByCode[code])
  const selected = cards.filter((card) => selectedIds.includes(card.id))
  const priorities = cards.filter((card) => card.id === legacyByCode[echoMood.dailyCard])
  const weather = weatherOptions.find((option) => option.id === weatherLegacyIdByCode[echoMood.weather]) ?? weatherOptions[2]
  const treatmentWeight = treatmentOptions.find((option) => option.id === weightLegacyIdByCode[echoMood.weight]) ?? null
  return {
    id: echoMood.id,
    createdAt: `${echoMood.date}T12:00:00.000Z`,
    date: echoMood.date,
    perspective: echoMood.mode,
    weatherScore: getLegacyWeatherScore(weather.id),
    impactScore: null,
    treatmentWeight,
    weather,
    selected,
    priorities,
    synthesis: buildSynthesis(weather, treatmentWeight, priorities[0], echoMood.mode),
    suggestedQuestion: getOpeningQuestion(priorities[0], echoMood.mode),
    echoMood,
    tip: null,
  }
}

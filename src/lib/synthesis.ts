import { questions } from '../data/echomood'
import { getWeatherScore } from './history'
import type { EchoMoodSummary, MoodCard, Perspective, TreatmentOption, WeatherOption } from '../types/domain'

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

  return {
    id: crypto.randomUUID(),
    createdAt,
    date: createdAt.slice(0, 10),
    perspective,
    weatherScore: getWeatherScore(weather.id),
    impactScore,
    treatmentWeight,
    weather,
    selected,
    priorities,
    synthesis: buildSynthesis(weather, treatmentWeight, dailyCard, perspective),
    tip: null,
    suggestedQuestion: getOpeningQuestion(dailyCard, perspective),
  }
}

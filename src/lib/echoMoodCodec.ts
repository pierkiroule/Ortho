import type { EchoMood, EchoMoodMode } from '../types/domain'

export const weatherDictionary = {
  sun: { emoji: '🌞', label: 'Grand soleil' },
  clear: { emoji: '🌤️', label: 'Éclaircies' },
  variable: { emoji: '⛅', label: 'Temps variable' },
  cloudy: { emoji: '☁️', label: 'Ciel couvert' },
  rain: { emoji: '🌧️', label: 'Pluie' },
  storm: { emoji: '⛈️', label: 'Tempête' },
} as const

export const weightDictionary = {
  balloon: { emoji: '🎈', label: 'Ballon' },
  bag: { emoji: '🎒', label: 'Sac' },
  suitcase: { emoji: '🧳', label: 'Valise' },
  rock: { emoji: '🪨', label: 'Rocher' },
} as const

export const resourceDictionary = {
  r1: { emoji: '😎', label: 'Je vois que ça change' },
  r2: { emoji: '💪', label: 'Je tiens le coup' },
  r3: { emoji: '🎯', label: 'Ça vaut le coup' },
  r4: { emoji: '✨', label: 'J’imagine mon futur sourire' },
  r5: { emoji: '🤝', label: 'Je me sens soutenu' },
  r6: { emoji: '🏆', label: 'Je suis fier de mes progrès' },
  r7: { emoji: '🪥', label: 'J’ai pris de bonnes habitudes' },
  r8: { emoji: '🧠', label: 'Je comprends ce qu’on me demande' },
} as const

export const difficultyDictionary = {
  d1: { emoji: '🪢', label: 'Les élastiques sont difficiles à porter' },
  d2: { emoji: '😬', label: 'Ça tire ou c’est sensible' },
  d3: { emoji: '🩹', label: 'L’appareil m’irrite parfois' },
  d4: { emoji: '⏳', label: 'J’aimerais que ça aille plus vite' },
  d5: { emoji: '📅', label: 'J’oublie parfois certaines consignes' },
  d6: { emoji: '🙈', label: 'Le regard des autres compte pour moi' },
  d7: { emoji: '🍽️', label: 'Manger est parfois compliqué' },
  d8: { emoji: '🤔', label: 'Je me pose encore des questions' },
} as const

export type WeatherCode = keyof typeof weatherDictionary
export type WeightCode = keyof typeof weightDictionary
export type ResourceCode = keyof typeof resourceDictionary
export type DifficultyCode = keyof typeof difficultyDictionary

const compactDate = (date: string) => date.replaceAll('-', '')
const expandDate = (date: string) => `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`

export function encodeEchoMood(echoMood: EchoMood) {
  return [
    'EMO1',
    echoMood.mode === 'parent' ? 'R' : 'P',
    compactDate(echoMood.date),
    echoMood.weather,
    echoMood.weight,
    echoMood.selectedResources.join(','),
    echoMood.selectedDifficulties.join(','),
    echoMood.dailyCard,
  ].join('|')
}

export function decodeEchoMood(code: string): EchoMood {
  const [version, modeCode, date, weather, weight, resources = '', difficulties = '', dailyCard = ''] = code.split('|')
  if (version !== 'EMO1') throw new Error('Format EchoMood non reconnu')
  return {
    id: `emo_${date}_decoded`,
    mode: (modeCode === 'R' ? 'parent' : 'patient') as EchoMoodMode,
    date: expandDate(date),
    weather: weather as WeatherCode,
    weight: weight as WeightCode,
    selectedResources: resources ? (resources.split(',') as ResourceCode[]) : [],
    selectedDifficulties: difficulties ? (difficulties.split(',') as DifficultyCode[]) : [],
    dailyCard: dailyCard as ResourceCode | DifficultyCode,
  }
}

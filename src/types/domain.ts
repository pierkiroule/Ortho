export type CardGroup = 'resource' | 'difficulty'
export type Perspective = 'patient' | 'parent'

export type MoodCard = {
  id: string
  emoji: string
  label: string
  parentLabel: string
  group: CardGroup
}

export type WeatherOption = {
  id: string
  emoji: string
  label: string
}

export type TipAudience = 'patient' | 'parent' | 'both'

export type EducationalTip = {
  id: string
  emoji: string
  title: string
  text: string
  audience: TipAudience
  cardIds?: string[]
  groups?: CardGroup[]
  weatherIds?: string[]
  minImpactScore?: number
  maxImpactScore?: number
}

export type EchoMoodSummary = {
  id: string
  createdAt: string
  weatherScore: number
  impactScore: number | null
  date: string
  perspective: Perspective
  weather: WeatherOption
  selected: MoodCard[]
  priorities: MoodCard[]
  synthesis: string
  suggestedQuestion: string
  tips: EducationalTip[]
}

export type EchoMoodEntry = EchoMoodSummary

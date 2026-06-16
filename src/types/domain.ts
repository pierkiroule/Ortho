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
}

export type EchoMoodEntry = EchoMoodSummary

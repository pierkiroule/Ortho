export type CardGroup = 'resource' | 'difficulty'

export type MoodCard = {
  id: string
  emoji: string
  label: string
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
  date: string
  weather: WeatherOption
  selected: MoodCard[]
  priorities: MoodCard[]
  synthesis: string
  suggestedQuestion: string
}

export type EchoMoodEntry = EchoMoodSummary

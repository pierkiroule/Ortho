import type { MoodCard, WeatherOption } from '../types/domain'

export const cards: MoodCard[] = [
  { id: 'changements', emoji: '😎', label: 'Je remarque des changements positifs', group: 'resource' },
  { id: 'perseverance', emoji: '💪', label: 'Je reste motivé, même quand c’est difficile', group: 'resource' },
  { id: 'sens', emoji: '🎯', label: 'Je trouve que ça en vaut la peine', group: 'resource' },
  { id: 'projection', emoji: '✨', label: 'J’imagine mon futur sourire', group: 'resource' },
  { id: 'soutien', emoji: '🤝', label: 'Je me sens aidé et soutenu', group: 'resource' },
  { id: 'fierte', emoji: '🏆', label: 'Je suis fier de mes progrès', group: 'resource' },
  { id: 'resultat', emoji: '😁', label: 'Je suis content du résultat', group: 'resource' },
  { id: 'habitudes', emoji: '🪥', label: 'J’ai pris de bonnes habitudes', group: 'resource' },
  { id: 'elastiques', emoji: '🪢', label: 'Les élastiques sont difficiles à supporter', group: 'difficulty' },
  { id: 'douleur', emoji: '😬', label: 'Je ressens des douleurs ou une sensibilité dentaire', group: 'difficulty' },
  { id: 'sommeil', emoji: '🌙', label: 'Mon sommeil est perturbé par l’appareil', group: 'difficulty' },
  { id: 'irritabilite', emoji: '😤', label: 'Je me sens plus irritable ou moins patient', group: 'difficulty' },
  { id: 'irritations', emoji: '🩹', label: 'L’appareil provoque des irritations dans la bouche', group: 'difficulty' },
  { id: 'duree', emoji: '⏳', label: 'J’aimerais que ça aille plus vite', group: 'difficulty' },
  { id: 'oubli', emoji: '📅', label: 'J’oublie parfois certaines consignes', group: 'difficulty' },
  { id: 'regard', emoji: '🙈', label: 'Le regard des autres me préoccupe', group: 'difficulty' },
  { id: 'manger', emoji: '🍽️', label: 'Manger est parfois compliqué', group: 'difficulty' },
  { id: 'lassitude', emoji: '😔', label: 'Je me sens découragé par moments', group: 'difficulty' },
  { id: 'questions', emoji: '🤔', label: 'Je me pose des questions', group: 'difficulty' },
]

export const weatherOptions: WeatherOption[] = [
  { id: 'soleil', emoji: '🌞', label: 'Grand soleil' },
  { id: 'eclaircies', emoji: '🌤️', label: 'Éclaircies' },
  { id: 'variable', emoji: '⛅', label: 'Variable' },
  { id: 'couvert', emoji: '☁️', label: 'Couvert' },
  { id: 'pluie', emoji: '🌧️', label: 'Pluie' },
  { id: 'orage', emoji: '⛈️', label: 'Orage' },
]

export const resourcePhrase: Record<string, string> = {
  changements: 'aux changements positifs déjà visibles',
  perseverance: 'à sa motivation, malgré les difficultés rencontrées',
  sens: 'au sens qu’il accorde à son traitement',
  projection: 'à la projection vers le résultat final',
  soutien: 'au soutien dont il bénéficie',
  fierte: 'à la fierté de ses progrès',
  resultat: 'à la satisfaction du résultat actuel',
  habitudes: 'aux bonnes habitudes mises en place',
}

export const difficultyPhrase: Record<string, string> = {
  elastiques: 'aux élastiques',
  douleur: 'aux douleurs ou à la sensibilité dentaire',
  sommeil: 'au retentissement sur le sommeil',
  irritabilite: 'à l’irritabilité ou à la fatigue émotionnelle',
  irritations: 'aux irritations dans la bouche',
  duree: 'à la durée du traitement',
  oubli: 'aux oublis occasionnels',
  regard: 'au regard des autres',
  manger: 'aux difficultés rencontrées au moment des repas',
  lassitude: 'au découragement ressenti par moments',
  questions: 'aux questions en suspens',
}

export const questions: Record<string, string> = {
  changements: 'Qu’est-ce qui te montre que le traitement avance ?',
  perseverance: 'Qu’est-ce qui t’aide à rester motivé au quotidien ?',
  sens: 'Qu’est-ce qui fait que ça vaut la peine pour toi aujourd’hui ?',
  projection: 'À quoi ressemble le sourire que tu imagines à la fin ?',
  soutien: 'Qui ou quoi t’aide le plus en ce moment ?',
  fierte: 'De quoi es-tu le plus fier dans ce parcours ?',
  resultat: 'Qu’est-ce qui te plaît le plus dans le résultat actuel ?',
  habitudes: 'Quelles habitudes as-tu mises en place, et comment ça se passe ?',
  elastiques: 'Qu’est-ce qui est le plus compliqué avec les élastiques en ce moment ?',
  douleur: 'À quels moments la douleur ou la sensibilité est-elle la plus présente ?',
  sommeil: 'Qu’est-ce qui gêne le plus ton sommeil en ce moment ?',
  irritabilite: 'Dans quels moments te sens-tu le plus irritable ou moins patient ?',
  irritations: 'Où l’appareil irrite-t-il le plus, et qu’est-ce qui te soulage ?',
  duree: 'Qu’est-ce qui t’aiderait à mieux tenir dans la durée ?',
  oubli: 'Qu’est-ce qui pourrait t’aider à moins oublier ?',
  regard: 'Dans quelles situations le regard des autres compte le plus ?',
  manger: 'Quels repas ou aliments sont les plus compliqués pour toi ?',
  lassitude: 'Qu’est-ce qui pourrait t’aider quand tu te sens découragé ?',
  questions: 'Quelles sont les questions qui te viennent le plus souvent ?',
}

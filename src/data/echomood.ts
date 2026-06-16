import type { EducationalTip, MoodCard, TreatmentOption, WeatherOption } from '../types/domain'

export const cards: MoodCard[] = [
  { id: 'changements', emoji: '😎', label: 'Je vois que ça change', parentLabel: 'Il voit que ça change', group: 'resource' },
  { id: 'perseverance', emoji: '💪', label: 'Je tiens le coup', parentLabel: 'Il tient le coup', group: 'resource' },
  { id: 'sens', emoji: '🎯', label: 'Ça vaut le coup', parentLabel: 'Il trouve que ça vaut la peine', group: 'resource' },
  { id: 'projection', emoji: '✨', label: 'J’imagine mon futur sourire', parentLabel: 'Il imagine son futur sourire', group: 'resource' },
  { id: 'soutien', emoji: '🤝', label: 'Je me sens soutenu', parentLabel: 'Il se sent soutenu', group: 'resource' },
  { id: 'fierte', emoji: '🏆', label: 'Je suis fier de mes progrès', parentLabel: 'Il est fier de ses progrès', group: 'resource' },
  { id: 'habitudes', emoji: '🪥', label: 'J’ai pris de bonnes habitudes', parentLabel: 'Il a pris de bonnes habitudes', group: 'resource' },
  { id: 'comprehension', emoji: '🧠', label: 'Je comprends ce qu’on me demande', parentLabel: 'Il comprend ce qu’on lui demande', group: 'resource' },
  { id: 'elastiques', emoji: '🪢', label: 'Les élastiques sont difficiles à porter', parentLabel: 'Les élastiques sont difficiles à porter', group: 'difficulty' },
  { id: 'douleur', emoji: '😬', label: 'Ça tire ou c’est sensible', parentLabel: 'Ça tire ou c’est sensible', group: 'difficulty' },
  { id: 'irritations', emoji: '🩹', label: 'L’appareil m’irrite parfois', parentLabel: 'L’appareil l’irrite parfois', group: 'difficulty' },
  { id: 'duree', emoji: '⏳', label: 'J’aimerais que ça aille plus vite', parentLabel: 'Il aimerait que ça aille plus vite', group: 'difficulty' },
  { id: 'oubli', emoji: '📅', label: 'J’oublie parfois certaines consignes', parentLabel: 'Il oublie parfois certaines consignes', group: 'difficulty' },
  { id: 'regard', emoji: '🙈', label: 'Le regard des autres compte pour moi', parentLabel: 'Le regard des autres compte pour lui', group: 'difficulty' },
  { id: 'manger', emoji: '🍽️', label: 'Manger est parfois compliqué', parentLabel: 'Manger est parfois compliqué', group: 'difficulty' },
  { id: 'questions', emoji: '🤔', label: 'Je me pose encore des questions', parentLabel: 'Il se pose encore des questions', group: 'difficulty' },
]

export const weatherOptions: WeatherOption[] = [
  { id: 'soleil', emoji: '🌞', label: 'Grand soleil', description: 'Je me sens bien.', parentDescription: 'Il se sent bien.' },
  { id: 'eclaircies', emoji: '🌤️', label: 'Éclaircies', description: 'Ça va plutôt bien.', parentDescription: 'Ça va plutôt bien.' },
  { id: 'variable', emoji: '⛅', label: 'Temps variable', description: 'Il y a des hauts et des bas.', parentDescription: 'Il y a des hauts et des bas.' },
  { id: 'couvert', emoji: '☁️', label: 'Ciel couvert', description: 'C’est un peu compliqué.', parentDescription: 'C’est un peu compliqué.' },
  { id: 'pluie', emoji: '🌧️', label: 'Pluie', description: 'C’est difficile en ce moment.', parentDescription: 'C’est difficile en ce moment.' },
  { id: 'orage', emoji: '⛈️', label: 'Tempête', description: 'Je traverse une période difficile.', parentDescription: 'Il traverse une période difficile.' },
]

export const treatmentOptions: TreatmentOption[] = [
  { id: 'ballon', emoji: '🎈', label: 'Ballon', description: 'Je l’oublie presque.', parentDescription: 'Il l’oublie presque.' },
  { id: 'sac', emoji: '🎒', label: 'Sac', description: 'Il m’accompagne au quotidien.', parentDescription: 'Il l’accompagne au quotidien.' },
  { id: 'valise', emoji: '🧳', label: 'Valise', description: 'Il prend beaucoup de place en ce moment.', parentDescription: 'Il prend beaucoup de place en ce moment.' },
  { id: 'rocher', emoji: '🪨', label: 'Rocher', description: 'Il est difficile à porter en ce moment.', parentDescription: 'Il est difficile à porter en ce moment.' },
]

export const questions: Record<string, { patient: string; parent: string }> = {
  elastiques: { patient: 'Qu’est-ce qui rend les élastiques difficiles à porter en ce moment ?', parent: 'Selon vous, qu’est-ce qui rend les élastiques difficiles à porter en ce moment ?' },
  douleur: { patient: 'À quels moments ça tire le plus ?', parent: 'Selon vous, à quels moments ça tire le plus ?' },
  irritations: { patient: 'Qu’est-ce qui irrite le plus dans la bouche actuellement ?', parent: 'Selon vous, qu’est-ce qui l’irrite le plus dans la bouche actuellement ?' },
  duree: { patient: 'Qu’est-ce qui t’aiderait à mieux vivre la durée du traitement ?', parent: 'Selon vous, qu’est-ce qui l’aiderait à mieux vivre la durée du traitement ?' },
  oubli: { patient: 'Qu’est-ce qui pourrait t’aider à penser plus facilement aux consignes ?', parent: 'Selon vous, qu’est-ce qui pourrait l’aider à penser plus facilement aux consignes ?' },
  regard: { patient: 'Dans quelles situations le regard des autres compte le plus ?', parent: 'Selon vous, dans quelles situations le regard des autres compte le plus ?' },
  manger: { patient: 'Quels moments ou aliments sont les plus compliqués en ce moment ?', parent: 'Selon vous, quels moments ou aliments sont les plus compliqués en ce moment ?' },
  questions: { patient: 'Quelle question aimerais-tu poser aujourd’hui ?', parent: 'Selon vous, quelle question aimerait-il poser aujourd’hui ?' },
  changements: { patient: 'Qu’est-ce qui te montre le plus que le traitement avance ?', parent: 'Selon vous, qu’est-ce qui lui montre le plus que le traitement avance ?' },
  perseverance: { patient: 'Qu’est-ce qui t’aide à tenir le coup ?', parent: 'Selon vous, qu’est-ce qui l’aide à tenir le coup ?' },
  sens: { patient: 'Qu’est-ce qui donne du sens au traitement pour toi ?', parent: 'Selon vous, qu’est-ce qui donne du sens au traitement pour lui ?' },
  projection: { patient: 'Qu’est-ce que tu imagines pour la suite ?', parent: 'Selon vous, qu’est-ce qu’il imagine pour la suite ?' },
  soutien: { patient: 'Qui ou quoi t’aide le plus en ce moment ?', parent: 'Selon vous, qui ou quoi l’aide le plus en ce moment ?' },
  fierte: { patient: 'De quoi es-tu le plus fier dans ton parcours ?', parent: 'Selon vous, de quoi est-il le plus fier dans son parcours ?' },
  habitudes: { patient: 'Quelle habitude t’aide le plus au quotidien ?', parent: 'Selon vous, quelle habitude l’aide le plus au quotidien ?' },
  comprehension: { patient: 'Qu’est-ce qui est le plus clair pour toi aujourd’hui ?', parent: 'Selon vous, qu’est-ce qui est le plus clair pour lui aujourd’hui ?' },
}

export const educationalTips: EducationalTip[] = []

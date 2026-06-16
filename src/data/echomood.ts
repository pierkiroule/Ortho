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
  { id: 'elastiques', emoji: '🪢', label: 'Les élastiques sont difficiles à porter', parentLabel: 'Les élastiques semblent difficiles à porter', group: 'difficulty' },
  { id: 'douleur', emoji: '😬', label: 'Ça tire ou c’est sensible', parentLabel: 'Ça semble tirer ou être sensible', group: 'difficulty' },
  { id: 'irritations', emoji: '🩹', label: 'L’appareil m’irrite parfois', parentLabel: 'L’appareil semble l’irriter parfois', group: 'difficulty' },
  { id: 'duree', emoji: '⏳', label: 'J’aimerais que ça aille plus vite', parentLabel: 'Il semble vouloir que ça aille plus vite', group: 'difficulty' },
  { id: 'oubli', emoji: '📅', label: 'J’oublie parfois certaines consignes', parentLabel: 'Il semble oublier parfois certaines consignes', group: 'difficulty' },
  { id: 'regard', emoji: '🙈', label: 'Le regard des autres compte pour moi', parentLabel: 'Le regard des autres semble compter pour lui', group: 'difficulty' },
  { id: 'manger', emoji: '🍽️', label: 'Manger est parfois compliqué', parentLabel: 'Manger semble parfois compliqué', group: 'difficulty' },
  { id: 'questions', emoji: '🤔', label: 'Je me pose encore des questions', parentLabel: 'Il semble encore se poser des questions', group: 'difficulty' },
]

export const weatherOptions: WeatherOption[] = [
  { id: 'soleil', emoji: '🌞', label: 'Grand soleil', description: 'Je me sens bien.', parentDescription: 'Il semble se sentir bien.' },
  { id: 'eclaircies', emoji: '🌤️', label: 'Éclaircies', description: 'Ça va plutôt bien.', parentDescription: 'Cela semble plutôt bien se passer.' },
  { id: 'variable', emoji: '⛅', label: 'Temps variable', description: 'Il y a des hauts et des bas.', parentDescription: 'Il semble y avoir des hauts et des bas.' },
  { id: 'couvert', emoji: '☁️', label: 'Ciel couvert', description: 'C’est un peu compliqué.', parentDescription: 'Cela semble un peu compliqué.' },
  { id: 'pluie', emoji: '🌧️', label: 'Pluie', description: 'C’est difficile en ce moment.', parentDescription: 'Cela semble difficile en ce moment.' },
  { id: 'orage', emoji: '⛈️', label: 'Tempête', description: 'Je traverse une période difficile.', parentDescription: 'Il semble traverser une période difficile.' },
]

export const treatmentOptions: TreatmentOption[] = [
  { id: 'ballon', emoji: '🎈', label: 'Ballon', description: 'Je l’oublie presque.', parentDescription: 'Il semble presque l’oublier.' },
  { id: 'sac', emoji: '🎒', label: 'Sac', description: 'Il m’accompagne au quotidien.', parentDescription: 'Il semble vivre avec au quotidien.' },
  { id: 'valise', emoji: '🧳', label: 'Valise', description: 'Il prend beaucoup de place en ce moment.', parentDescription: 'Cela semble prendre beaucoup de place.' },
  { id: 'rocher', emoji: '🪨', label: 'Rocher', description: 'Il est difficile à porter en ce moment.', parentDescription: 'Cela semble difficile à porter en ce moment.' },
]

export const questions: Record<string, { patient: string; parent: string }> = {
  elastiques: { patient: 'Qu’est-ce qui rend les élastiques difficiles à porter en ce moment ?', parent: 'Qu’est-ce qui semble rendre les élastiques difficiles à porter en ce moment ?' },
  douleur: { patient: 'À quels moments ça tire le plus ?', parent: 'À quels moments cela semble le plus sensible ?' },
  irritations: { patient: 'Qu’est-ce qui irrite le plus dans la bouche actuellement ?', parent: 'Qu’est-ce qui semble l’irriter le plus actuellement ?' },
  duree: { patient: 'Qu’est-ce qui t’aiderait à mieux vivre la durée du traitement ?', parent: 'Qu’est-ce qui pourrait l’aider à mieux vivre la durée du traitement ?' },
  oubli: { patient: 'Qu’est-ce qui pourrait t’aider à penser plus facilement aux consignes ?', parent: 'Qu’est-ce qui pourrait l’aider à penser plus facilement aux consignes ?' },
  regard: { patient: 'Dans quelles situations le regard des autres compte le plus ?', parent: 'Dans quelles situations le regard des autres semble le plus compter ?' },
  manger: { patient: 'Quels moments ou aliments sont les plus compliqués en ce moment ?', parent: 'Quels moments ou aliments semblent les plus compliqués ?' },
  questions: { patient: 'Quelle question aimerais-tu poser aujourd’hui ?', parent: 'Quelle question serait importante à poser aujourd’hui ?' },
  changements: { patient: 'Qu’est-ce qui te montre le plus que le traitement avance ?', parent: 'Qu’est-ce qui semble lui montrer que le traitement avance ?' },
  perseverance: { patient: 'Qu’est-ce qui t’aide à tenir le coup ?', parent: 'Qu’est-ce qui semble l’aider à tenir le coup ?' },
  sens: { patient: 'Qu’est-ce qui donne du sens au traitement pour toi ?', parent: 'Qu’est-ce qui semble donner du sens au traitement pour lui ?' },
  projection: { patient: 'Qu’est-ce que tu imagines pour la suite ?', parent: 'Qu’est-ce qu’il semble imaginer pour la suite ?' },
  soutien: { patient: 'Qui ou quoi t’aide le plus en ce moment ?', parent: 'Qui ou quoi semble le plus l’aider en ce moment ?' },
  fierte: { patient: 'De quoi es-tu le plus fier dans ton parcours ?', parent: 'De quoi semble-t-il le plus fier dans son parcours ?' },
  habitudes: { patient: 'Quelle habitude t’aide le plus au quotidien ?', parent: 'Quelle habitude semble l’aider le plus au quotidien ?' },
  comprehension: { patient: 'Qu’est-ce qui est le plus clair pour toi aujourd’hui ?', parent: 'Qu’est-ce qui semble le plus clair pour lui aujourd’hui ?' },
}

export const educationalTips: EducationalTip[] = []

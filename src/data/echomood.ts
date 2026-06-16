import type { EducationalTip, MoodCard, WeatherOption } from '../types/domain'

export const cards: MoodCard[] = [
  { id: 'changements', emoji: '😎', label: 'Je remarque des changements positifs', parentLabel: 'Votre enfant remarque des changements positifs', group: 'resource' },
  { id: 'perseverance', emoji: '💪', label: 'Je vois mon enfant rester motivé, même quand c’est difficile', parentLabel: 'Votre enfant reste motivé, même quand c’est difficile', group: 'resource' },
  { id: 'sens', emoji: '🎯', label: 'Je trouve que ça en vaut la peine', parentLabel: 'Votre enfant sent que ça en vaut la peine', group: 'resource' },
  { id: 'projection', emoji: '✨', label: 'J’imagine mon futur sourire', parentLabel: 'Votre enfant se projette dans son futur sourire', group: 'resource' },
  { id: 'soutien', emoji: '🤝', label: 'Je me sens aidé et soutenu', parentLabel: 'Votre enfant se sent aidé et soutenu', group: 'resource' },
  { id: 'fierte', emoji: '🏆', label: 'Je suis fier de mes progrès', parentLabel: 'Votre enfant semble fier de ses progrès', group: 'resource' },
  { id: 'resultat', emoji: '😁', label: 'Je suis content du résultat', parentLabel: 'Votre enfant semble content du résultat', group: 'resource' },
  { id: 'habitudes', emoji: '🪥', label: 'J’ai pris de bonnes habitudes', parentLabel: 'Votre enfant a pris de bonnes habitudes', group: 'resource' },
  { id: 'elastiques', emoji: '🪢', label: 'Les élastiques sont difficiles à supporter', parentLabel: 'Votre enfant vit difficilement les élastiques', group: 'difficulty' },
  { id: 'douleur', emoji: '😬', label: 'Je ressens des douleurs ou une sensibilité dentaire', parentLabel: 'Votre enfant ressent des douleurs ou une sensibilité dentaire', group: 'difficulty' },
  { id: 'sommeil', emoji: '🌙', label: 'Mon sommeil est perturbé par l’appareil', parentLabel: 'Votre enfant dort moins bien à cause de l’appareil', group: 'difficulty' },
  { id: 'irritabilite', emoji: '😤', label: 'Je me sens plus irritable ou moins patient', parentLabel: 'Votre enfant semble plus irritable ou moins patient', group: 'difficulty' },
  { id: 'irritations', emoji: '🩹', label: 'L’appareil provoque des irritations dans la bouche', parentLabel: 'Votre enfant a des irritations dans la bouche', group: 'difficulty' },
  { id: 'duree', emoji: '⏳', label: 'J’aimerais que ça aille plus vite', parentLabel: 'Votre enfant aimerait que le traitement aille plus vite', group: 'difficulty' },
  { id: 'oubli', emoji: '📅', label: 'J’oublie parfois certaines consignes', parentLabel: 'Votre enfant oublie parfois certaines consignes', group: 'difficulty' },
  { id: 'regard', emoji: '🙈', label: 'Le regard des autres me préoccupe', parentLabel: 'Votre enfant semble préoccupé par le regard des autres', group: 'difficulty' },
  { id: 'manger', emoji: '🍽️', label: 'Manger est parfois compliqué', parentLabel: 'Votre enfant trouve que manger est parfois compliqué', group: 'difficulty' },
  { id: 'lassitude', emoji: '😔', label: 'Je me sens découragé par moments', parentLabel: 'Votre enfant semble découragé par moments', group: 'difficulty' },
  { id: 'questions', emoji: '🤔', label: 'Je me pose des questions', parentLabel: 'Votre enfant se pose des questions', group: 'difficulty' },
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

export const educationalTips: EducationalTip[] = [
  { id: 'douleur-court', emoji: '🧊', title: 'Douleur après activation', text: 'Prévoir des aliments souples pendant 24 à 48 h et noter ce qui soulage pour en reparler au cabinet.', audience: 'both', cardIds: ['douleur'], weatherIds: ['couvert', 'pluie', 'orage'] },
  { id: 'irritations-cire', emoji: '🩹', title: 'Irritations dans la bouche', text: 'Repérer la zone qui frotte, utiliser la cire orthodontique si elle a été conseillée, et signaler toute blessure persistante.', audience: 'both', cardIds: ['irritations'] },
  { id: 'elastiques-rituel', emoji: '🪢', title: 'Rendre les élastiques plus automatiques', text: 'Associer les élastiques à deux routines fixes, par exemple après le brossage du matin et avant de dormir.', audience: 'patient', cardIds: ['elastiques', 'oubli'] },
  { id: 'parents-consignes', emoji: '📌', title: 'Aider sans contrôler', text: 'Les parents peuvent proposer un rappel neutre et bref, puis laisser le jeune cocher lui-même sa routine.', audience: 'parent', cardIds: ['oubli', 'elastiques'] },
  { id: 'regard-phrase', emoji: '💬', title: 'Préparer une phrase simple', text: 'Face aux questions des autres, préparer une réponse courte peut redonner du contrôle : “c’est mon traitement, il avance”.', audience: 'both', cardIds: ['regard'] },
  { id: 'repas-confort', emoji: '🍽️', title: 'Adapter les repas compliqués', text: 'Lister deux repas faciles les jours sensibles et couper les aliments en petits morceaux pour limiter l’effort.', audience: 'both', cardIds: ['manger', 'douleur'] },
  { id: 'sommeil-signal', emoji: '🌙', title: 'Sommeil à surveiller', text: 'Si l’appareil gêne plusieurs nuits de suite, noter l’heure, la gêne et l’intensité pour ajuster les conseils.', audience: 'both', cardIds: ['sommeil'] },
  { id: 'motivation-photo', emoji: '📸', title: 'Voir les progrès', text: 'Comparer avec une photo ou un souvenir du début aide à rendre les progrès visibles quand la durée paraît longue.', audience: 'patient', cardIds: ['changements', 'fierte', 'duree', 'lassitude'] },
  { id: 'questions-liste', emoji: '🤔', title: 'Transformer les questions en plan', text: 'Écrire les trois questions prioritaires avant le rendez-vous facilite une discussion claire avec le praticien.', audience: 'both', cardIds: ['questions'] },
  { id: 'orage-pause', emoji: '🧘', title: 'Quand le mood est bas', text: 'Choisir une micro-action réaliste pour aujourd’hui seulement : un brossage réussi, une question posée ou une pause calme.', audience: 'both', groups: ['difficulty'], weatherIds: ['pluie', 'orage'], minImpactScore: 6 },
  { id: 'ressource-ancrage', emoji: '🌟', title: 'Ancrer ce qui marche', text: 'Nommer précisément ce qui aide déjà permet de le répéter les jours plus difficiles.', audience: 'both', groups: ['resource'] },
  { id: 'parent-ecoute', emoji: '👂', title: 'Ouvrir l’échange', text: 'Commencer par “qu’est-ce qui est le plus pénible aujourd’hui ?” avant de proposer une solution favorise la coopération.', audience: 'parent', groups: ['difficulty'] },
] satisfies EducationalTip[]

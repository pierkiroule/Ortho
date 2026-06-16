# EchoMood Ortho

Webapp locale React + Vite pour transformer le vécu orthodontique d'un patient en synthèse visuelle, partageable et téléchargeable.

## Fonctionnalités

- Parcours mobile-first en 5 étapes : accueil, cartes, priorités, météo, synthèse.
- Aucune API et aucun backend : les données restent dans le navigateur.
- QR code autonome : il encode une `data:text/html` contenant une page minimaliste de la synthèse. La personne qui scanne ouvre donc la synthèse directement dans son navigateur, sans serveur.
- Export PNG de la carte de synthèse.
- Configuration Vercel prête pour un déploiement Vite statique.

## Développement

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Déploiement Vercel

Le fichier `vercel.json` force le framework Vite, la commande `npm run build` et le dossier de sortie `dist`.

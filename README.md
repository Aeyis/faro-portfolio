# Faro — Portfolio de Rafael Solis Ramos

Portfolio personnel conçu comme une expérience visuelle immersive. Chaque section est animée, chaque détail est intentionnel.

## Stack

| Catégorie | Technologies |
|---|---|
| Framework | Next.js 16 · React 19 · TypeScript |
| Animation | GSAP 3 + ScrollTrigger · Lenis (smooth scroll) |
| 3D / Physique | Three.js · Matter.js |
| Style | Tailwind CSS 4 |
| Emails | EmailJS |
| Typo | SplitType |

## Sections

- **Hero** — scène parallax ciel/mer au coucher du soleil, intro animée
- **À propos** — scroll narratif en trois écrans, fond sous-marin canvas
- **Stack** — bouteilles interactives avec physique Matter.js, logos qui rebondissent
- **Projets** — cartes animées au scroll
- **Contact** — formulaire EmailJS avec validation

## Particularités techniques

- Animations GSAP pilotées au scroll via ScrollTrigger, synchronisées avec Lenis
- Fond sous-marin généré sur canvas (WebGL-like, pur 2D)
- Bouteilles : simulation physique Matter.js dans un canvas React
- Responsive mobile dédié avec sections et animations adaptées
- Menu mobile hamburger avec demi-cercle flottant
- Bilingue FR / EN

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3001](http://localhost:3001).

```bash
npm run build
npm start   # http://localhost:3000
```

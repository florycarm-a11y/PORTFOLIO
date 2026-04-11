# MonPortfolio

## Description

Portfolio développeur — site statique HTML/CSS/JS vanilla.

## Architecture

- index.html — Page unique (single-page)
- css/style.css — Styles globaux
- js/main.js — Interactivité
- assets/images/ — Images et icônes

## Conventions de code

- HTML sémantique (header, main, section, footer)
- CSS : méthodologie BEM pour le nommage des classes
- JavaScript : vanilla uniquement, pas de framework ni librairie
- Variables et fonctions en anglais
- Contenu visible en français
- Mobile-first : concevoir d'abord pour mobile, puis adapter pour desktop

## Design

- Palette : fond sombre (#0a0a0a), texte clair (#e0e0e0), accent (#64ffda)
- Police : Inter (Google Fonts)
- Espacement généreux, design aéré
- Animations subtiles (transitions CSS, pas de librairie)

## Interdictions

- Pas de jQuery
- Pas de framework CSS (Bootstrap, Tailwind)
- Pas de bundler (Webpack, Vite)
- Ne jamais modifier ce fichier CLAUDE.md sans permission explicite

## Interdictions absolues (sécurité)

- Ne jamais lire ~/.ssh/ ni aucun fichier contenant des credentials
- Ne jamais lire .env, *.key, *secret*, credentials.json
- Ne jamais exécuter `rm -rf`, `sudo`, ni `curl` vers des URL inconnues
- Ne jamais committer de fichiers `.env`, `CLAUDE.local.md`, clés API ou tokens
- Ne jamais force-push sur `main` sans confirmation explicite de l'utilisateur

## Commandes

- Ouvrir le site : open index.html (macOS) / xdg-open index.html (Linux)

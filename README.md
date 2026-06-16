# BeautyConnect — Application React

Plateforme de réservation de coiffure à Abidjan (puis Côte d'Ivoire), construite avec **React + Vite + Tailwind**. Thème doré / bordeaux luxe, une seule police (Fraunces), sans emojis.

## Lancer le projet

Prérequis : Node.js 18+.

```bash
npm install      # installe les dépendances
npm run dev      # serveur de développement (http://localhost:5173)
npm run build    # build de production dans dist/
npm run preview  # prévisualise le build de production
```

Un build prêt à l'emploi est déjà présent dans `dist/` : ouvrez `dist/index.html` dans un navigateur pour voir le site sans rien installer (la navigation utilise des URLs `#/` pour fonctionner même en local).

## Structure

```
index.html              point d'entrée Vite
src/
  main.jsx              montage React
  App.jsx               routing (React Router, HashRouter)
  index.css             design system (variables, composants, Tailwind)
  data/salons.js        données salons, prestations, communes, helpers
  lib/illustration.js   photos réelles + illustrations SVG de repli
  lib/maps.js           liens Google Maps & Yango
  components/           Navbar, Footer, SalonCard, Thumb (photo + repli)
  pages/                Home, Search, SalonDetail, Diagnostic, Login,
                        SalonDashboard, Admin
legacy-html/            ancienne version statique (HTML/CSS/JS), conservée
```

## Pages (routes)

- `/` — accueil : recherche, communes, prestations, diagnostic, salons en vedette
- `/recherche` — filtres dynamiques + carte Google Maps + liens Maps/Yango
- `/salon/:id` — fiche salon : galerie, prestations, localisation, avis, réservation en 4 étapes
- `/diagnostic` — diagnostic capillaire (suggestions + estimation de prix)
- `/connexion` — connexion / inscription (profil cliente ou salon)
- `/espace-salon` — tableau de bord salon (calendrier, prestations, galerie, abonnement)
- `/admin` — tableau de bord administrateur (stats, validation, réclamations)

## Cartes & transport

Carte Google Maps intégrée (embed, sans clé API). Les boutons ouvrent l'itinéraire dans Google Maps (`maps/dir`) ou commandent une course **Yango** (`yango.go.link/route`) vers les coordonnées du salon. Coordonnées de démonstration par commune dans `src/data/salons.js`.

## Images

Vraies photos de coiffures (Wikimedia Commons, libres de droits) chargées via `Special:FilePath`, avec repli automatique sur une illustration vectorielle dorée/bordeaux si une photo ne charge pas (composant `Thumb`). URLs centralisées dans `src/lib/illustration.js`.

## Pour la production

Stack cible du cahier des charges : ce front React, à connecter à un back-end Laravel + PostgreSQL, avec Google Maps API, Twilio / WhatsApp Business (notifications) et CinetPay / PayDunya / Flutterwave / Mobile Money (paiement). Les données sont actuellement simulées côté client.

# Geo Collectivites Explorer

Application web SIG construite avec Next.js pour rechercher des communes francaises, afficher leur position sur une carte interactive et consulter quelques informations administratives.

![Capture de l'application](/Users/verdoyant/dev/geo-collectivites-explorer/public/screenshots/app-home.png)

## Objectif du projet

Le projet sert de base d'exploration cartographique autour des communes francaises. L'idee est simple :

- saisir un nom de commune ;
- interroger l'API publique `geo.api.gouv.fr` ;
- recuperer les resultats au format GeoJSON ;
- afficher la commune selectionnee sur une carte Leaflet ;
- presenter ses principales informations dans un panneau lateral.

Ce projet est volontairement compact. Il montre surtout comment faire communiquer une interface React, une route API Next.js, une source de donnees geographiques externe et une carte web interactive.

## Comment l'application fonctionne

### 1. Recherche utilisateur

Le composant [`src/components/search/CommuneSearch.tsx`](/Users/verdoyant/dev/geo-collectivites-explorer/src/components/search/CommuneSearch.tsx) gere le champ de recherche.

- L'utilisateur saisit un nom de commune.
- Une recherche est declenchee avec un delai de 350 ms pour eviter de solliciter l'API a chaque frappe.
- Le composant appelle `searchCommunes()` depuis [`src/lib/geo-api.ts`](/Users/verdoyant/dev/geo-collectivites-explorer/src/lib/geo-api.ts).
- Cette fonction interroge la route interne `/api/communes?q=...`.

### 2. Passage par l'API Next.js

La route [`src/app/api/communes/route.ts`](/Users/verdoyant/dev/geo-collectivites-explorer/src/app/api/communes/route.ts) joue le role de proxy serveur vers `https://geo.api.gouv.fr/communes`.

Elle :

- recupere le parametre `q` ;
- appelle l'API Geo avec `format=geojson` ;
- demande uniquement certains champs utiles ;
- recupere la geometrie `centre` de chaque commune ;
- renvoie la reponse au front en JSON ;
- met en cache la reponse pendant 1 heure avec `revalidate: 3600`.

Ce passage par une route interne permet de centraliser la logique d'appel, de mieux controler les parametres envoyes et de garder le front decouple de l'API externe.

### 3. Selection d'une commune

Quand un resultat est clique :

- le composant de recherche remonte la `feature` selectionnee au composant principal ;
- la page [`src/app/page.tsx`](/Users/verdoyant/dev/geo-collectivites-explorer/src/app/page.tsx) stocke cette commune dans un `useState` ;
- cet etat est partage a la fois avec la carte et avec le panneau d'informations.

### 4. Affichage cartographique

Le composant [`src/components/map/MapView.tsx`](/Users/verdoyant/dev/geo-collectivites-explorer/src/components/map/MapView.tsx) affiche la carte avec React-Leaflet.

- La carte est centree au depart sur la France.
- Quand une commune est selectionnee, un marqueur est place sur son centre.
- Une popup affiche son nom et son code INSEE.
- Le composant `FitToFeature` repositionne la carte sur la commune selectionnee avec un zoom a 12.

Le composant est charge via `dynamic(..., { ssr: false })` dans [`src/app/page.tsx`](/Users/verdoyant/dev/geo-collectivites-explorer/src/app/page.tsx), car Leaflet depend du navigateur et ne doit pas etre rendu cote serveur.

### 5. Panneau d'informations

Le composant [`src/components/sidebar/infoPanel.tsx`](/Users/verdoyant/dev/geo-collectivites-explorer/src/components/sidebar/infoPanel.tsx) affiche :

- le nom de la commune ;
- le code INSEE ;
- le code departement ;
- le code region ;
- la population si elle est disponible.

Si aucune commune n'est selectionnee, le panneau affiche un texte d'introduction.

## Structure du projet

```text
src/
  app/
    api/communes/route.ts      # Route serveur qui interroge geo.api.gouv.fr
    globals.css                # Styles globaux + personnalisation Leaflet
    layout.tsx                 # Layout global et metadata
    page.tsx                   # Composition principale de l'interface
  components/
    map/MapView.tsx            # Carte interactive Leaflet
    search/CommuneSearch.tsx   # Champ de recherche + liste de resultats
    sidebar/infoPanel.tsx      # Fiche d'informations de la commune
  lib/
    geo-api.ts                 # Appel du front vers /api/communes
    types.ts                   # Types TypeScript des donnees GeoJSON
public/
  screenshots/app-home.png     # Capture d'ecran de l'application
```

## Modele de donnees

Le type principal est defini dans [`src/lib/types.ts`](/Users/verdoyant/dev/geo-collectivites-explorer/src/lib/types.ts).

L'application manipule une `FeatureCollection` GeoJSON dont chaque `feature` contient :

- une geometrie de type `Point` ;
- des proprietes metier comme `nom`, `code`, `codeDepartement`, `codeRegion`, `population` et `type`.

Dans l'etat actuel, l'application exploite le centre geographique de la commune, pas son contour administratif complet.

## Stack technique

- `Next.js 16` pour la structure applicative, les routes API et le rendu
- `React 19` pour l'interface
- `TypeScript` pour le typage
- `Leaflet` + `react-leaflet` pour la cartographie interactive
- `Tailwind CSS 4` pour le styling

## Sources de donnees

- [geo.api.gouv.fr](https://geo.api.gouv.fr/documentation) pour les communes francaises
- [OpenStreetMap](https://www.openstreetmap.org) pour les tuiles cartographiques

## Ce que le projet couvre bien

- integration d'une API geographique publique ;
- manipulation de donnees GeoJSON ;
- synchronisation entre liste de resultats, carte et panneau d'informations ;
- mise en place d'une carte interactive dans une application Next.js.

## Limites actuelles

Aujourd'hui, l'application reste une base simple :

- elle affiche le centre des communes et non leur polygone ;
- elle ne propose ni filtres avances ni couches multiples ;
- elle ne gere pas encore les erreurs de recherche de maniere tres visible pour l'utilisateur ;
- elle ne stocke pas d'historique ou de favoris.

## Lancer le projet en local

### Prerequis

- Node.js 20+ recommande
- npm

### Installation

```bash
npm install
```

### Developpement

```bash
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

### Verification

```bash
npm run lint
```

## Pistes d'evolution

- afficher les contours complets des communes au lieu d'un simple point ;
- ajouter des filtres par departement ou region ;
- enrichir la fiche commune avec davantage de donnees administratives ;
- gerer un etat de chargement et d'erreur plus detaille ;
- ajouter des tests sur la route API et les composants principaux.

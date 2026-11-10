# Site du couple

Tout le site tient dans `index.html` (+ un dossier `photos/`). Modifie le bloc `const C` en haut du script : prénom, date des retrouvailles, dates, pays, photos.
 
Publier : dépôt GitHub public, `index.html` et `photos/` à la racine, Settings > Pages > branche main, dossier / (root).
 
Partager listes et capsules : projet Firebase gratuit, base Firestore avec règles `allow read, write: if true;`, puis colle la config web dans `firebase:{...}`. Sans Firebase, tout reste sur l'appareil.

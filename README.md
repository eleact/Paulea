# Site du couple

1. Mets tes photos dans `photos/` et liste-les dans `config.js` (lat/lng + `fav:true` pour les voir sur la carte).
2. Mets la vraie date des retrouvailles et le prénom dans `config.js`.
3. GitHub : nouveau dépôt, envoie tous les fichiers, puis Settings > Pages > branche `main`, dossier `/ (root)`.
4. Listes et capsules partagées (sinon elles restent sur ton navigateur) : crée un projet Firebase gratuit, active Firestore, copie la config web dans `firebase:{...}` de `config.js`. Règles Firestore simples : `allow read, write: if true;` sur `films`, `musiques`, `capsules`.

# Pooncast – Back Office

Interface d’administration du projet **Le Pooncast**, plateforme de podcasts dédiée aux enfants (https://lepooncast.com).  
Ce back office contrôle les contenus visibles sur le front office Nuxt (https://github.com/aschne-dev/nuxt_pooncast_fo) en s’appuyant sur Firebase (Authentication, Firestore, Storage, Cloud Functions).

## Aperçu

Le back office offre une interface complète pour :

- administrer saisons et épisodes (métadonnées, visuels, liens vers les plateformes d’écoute) ;
- modérer les participations audio envoyées par les enfants ;
- gérer la newsletter, les recommandations et la FAQ affichées sur le front ;
- publier des articles de blog avec mise en forme riche.

## Fonctionnalités clés

- **Authentification** protégée par Firebase Auth + middleware Nuxt (redirection automatique vers `/login`).  
- **Gestion des saisons / épisodes** avec upload Storage, numérotation automatique et liens multi-plateformes.  
- **Modération audio** : suivi du statut, favoris, purge des fichiers Storage.  
- **Newsletter & opt-in** : filtrage opt-in/out, export et consultation rapide.  
- **Recommandations** : CRUD complet avec aperçu en carousel.  
- **PoonBlog** : éditeur Quill, chapitrage, réordonnancement.  
- **FAQ dynamique** : tri et drag & drop de l’ordre d’affichage.  
- **Navigation personnalisée** issue de la collection `bo_users` (profil + déconnexion).

## Stack technique

- **Nuxt 3** & Vue 3 (Composition API, layouts personnalisés).  
- **Pinia** pour la gestion d’état par domaine (`stores/`).  
- **VueFire / Firebase** : Auth, Firestore, Storage, fonctions via Nitro (`server_bo`).  
- **Tailwind CSS** avec palette personnalisée + fonts Fraunces / Syne / Nunito.  
- **@vueup/vue-quill**, **vue3-carousel**, **@ivanv/vue-collapse-transition** pour les composants UI spécifiques.

## Structure du dépôt

- `pages/` : vues Nuxt (épisodes, participations, newsletter, reco, FAQ, blog, login).  
- `components/` : organisation par domaine fonctionnel (`Pooncast/`, `Participations/`, `Newsletter/`, etc.).  
- `stores/` : modules Pinia (`Pooncast`, `PooncastSeason`, `Participations`, `Newsletter`, `Reco`, `Blog`, `FAQ`).  
- `middleware/auth.global.ts` : redirection automatique selon l’état d’authentification.  
- `layouts/` : layout principal (sidebar) et layout léger pour `/login`.  
- `assets/` : configuration Tailwind (`assets/css/tailwind.css`) et logos plateformes.  
- `nuxt.config.ts` : activation des modules, config Firebase client, Nitro Firebase Functions, désactivation SSR sur les écrans d’édition.

### Collections Firestore utilisées

| Collection               | Usage                                                                       |
| ------------------------ | --------------------------------------------------------------------------- |
| `seasons`                | Métadonnées des saisons (titre, formulaire de participation).               |
| `pooncasts`              | Épisodes (description, audio, visuel Storage, ordre).                       |
| `participations`         | Contributions audio, statut (`new` / `processed`), favoris.                 |
| `ParticipationsCounters` | Compteur d’incrémentation pour les participations.                          |
| `newsletter`             | Inscriptions email + consentement.                                          |
| `recommendations`        | Témoignages affichés sur le front.                                          |
| `blogs`                  | Articles (chapitres, visuel, ordre d’affichage).                            |
| `faq`                    | Questions / réponses et position.                                           |
| `bo_users`               | Informations affichées dans la barre latérale (profil BO).                  |

## Prérequis

- Node.js 18.20+ et npm.  
- Compte Firebase configuré (`.firebaserc` pointe vers `lepooncast-aec97`).  
- Firebase CLI (`npm install -g firebase-tools`).  
- Fichier de service Firebase Admin (JSON) stocké localement **hors VCS**.

## Installation & configuration

1. **Clonage & dépendances**

   ```bash
   git clone https://github.com/<votre-compte>/pooncast_bo.git
   cd pooncast_bo
   npm install
   ```

2. **Variables d’environnement**

   - Créez un fichier `.env` (et `.env.production` si nécessaire) et renseignez :
     ```bash
     GOOGLE_APPLICATION_CREDENTIALS=/chemin/vers/le-service-account.json
     NUXT_FIREBASE_API_KEY=...               
     NUXT_FIREBASE_AUTH_DOMAIN=...           
     NUXT_FIREBASE_PROJECT_ID=...            
     NUXT_FIREBASE_STORAGE_BUCKET=...        
     NUXT_FIREBASE_MESSAGING_SENDER_ID=...   
     NUXT_FIREBASE_APP_ID=...                
     ```
     Remplacez chaque `...` par la valeur fournie dans la console Firebase.
   - Sécurisez le fichier de credentials (ex. `lepooncast-aec97-firebase-adminsdk-xxxxx.json`) et mettez à jour `GOOGLE_APPLICATION_CREDENTIALS` avec son chemin absolu.

3. **Synchronisation des variables côté Firebase Functions**

   Pour rester cohérent avec la configuration existante (`firebase functions:config`), exécutez :
   ```bash
   firebase functions:config:set \
     nuxt.firebase_api_key="<clé API>" \
     nuxt.firebase_auth_domain="<domaine auth>" \
     nuxt.firebase_project_id="<project id>" \
     nuxt.firebase_storage_bucket="<bucket>" \
     nuxt.firebase_messaging_sender_id="<sender id>" \
     nuxt.firebase_app_id="<app id>"
   ```
   Ces clés sont définies en minuscules dans la CLI mais exposées en majuscules dans vos Cloud Functions Gen 2 (`process.env.NUXT_FIREBASE_API_KEY`, etc.).  
   Redéployez ensuite : `firebase deploy --only functions`.

## Développement local

```bash
npm run dev
```

- L’interface est disponible sur `http://localhost:3000`.  
- Connectez-vous avec un compte Firebase Auth autorisé et présent dans `bo_users` pour l’affichage du profil BO.

### Vérifications rapides

- Créez une saison + épisode, validez l’upload Storage et la numérotation.  
- Traitez une participation front → back (statut, favoris, suppression Storage).  
- Rédigez un article de blog (Quill), réordonnez les chapitres.  
- Ajoutez une recommandation et vérifiez l’aperçu carousel.  
- Modifiez l’ordre de la FAQ et confirmez la persistance.  
- Testez la déconnexion (signOut) et la redirection `/login`.

## Build & déploiement

```bash
npm run build          # génère .output (app + fonctions)
firebase login         # à exécuter si vous n’êtes pas déjà authentifié
firebase use <project> # utile si vous gérez plusieurs projets
firebase deploy        # hébergement + fonction SSR server_bo
```

- `firebase.json` déploie automatiquement `.output/public` sur Hosting et la fonction `server_bo` (région `europe-west1`).  
- Pour valider la version production en local : `npm run preview`.

## Scripts npm

| Script             | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| `npm run dev`      | Lance Nuxt en mode développement.                                       |
| `npm run build`    | Compile l’application et prépare les fonctions Firebase.                |
| `npm run preview`  | Sert la version compilée localement.                                    |
| `npm run generate` | Génère une version statique (non utilisée pour le déploiement SSR).     |

## Ressources utiles

- Front office : https://github.com/aschne-dev/nuxt_pooncast_fo  
- Site public : https://lepooncast.com (miroir Firebase : https://lepooncast-aec97.web.app/)  
- Documentation Nuxt 3 : https://nuxt.com/docs  
- Documentation VueFire : https://vuefire.vuejs.org/  
- Documentation Firebase (Hosting, Functions) : https://firebase.google.com/docs

## Pistes d’amélioration

- Centraliser les règles de sécurité Firestore pour restreindre les accès selon les rôles back office.  
- Mettre en place des tests end-to-end (Cypress / Playwright) sur les flux critiques.  
- Prévoir une stratégie de sauvegarde pour les médias stockés dans Firebase Storage.  
- Automatiser la synchronisation des variables d’environnement via CI/CD.

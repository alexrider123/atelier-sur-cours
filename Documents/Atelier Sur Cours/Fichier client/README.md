# Atelier Sur Cours — Fiche Client

Formulaire web client en deux étapes (saisie → confirmation) qui enregistre les données dans Google Sheets via Apps Script.

---

## Fichiers

| Fichier      | Rôle |
|---|---|
| `index.html` | Formulaire côté client (HTML + CSS + JS) |
| `Code.gs`    | Script Google Apps Script (backend) |
| `README.md`  | Ce guide |

---

## Mise en place — étape par étape

### 1. Créer le Google Sheet

1. Ouvrez [Google Sheets](https://sheets.google.com) et créez un nouveau classeur.
2. Renommez le premier onglet **`Clients`**.
3. En ligne 1, ajoutez les en-têtes dans cet ordre exact (une par colonne) :

   | A | B | C | D | E | F | G | H | I | J | K | L |
   |---|---|---|---|---|---|---|---|---|---|---|---|
   | Nom entreprise | SIREN | Nom | Prénom | Téléphone | Email | Adresse | Code Postal | Ville | Pays | Notes | Timestamp |

4. Copiez l'**ID du classeur** depuis l'URL :
   ```
   https://docs.google.com/spreadsheets/d/ >>>SHEET_ID<<< /edit
   ```

---

### 2. Configurer Apps Script

1. Dans le classeur, cliquez sur **Extensions → Apps Script**.
2. Supprimez le contenu du fichier `Code.gs` et collez-y le contenu de `Code.gs` fourni dans ce projet.
3. En haut du fichier, remplacez :
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID';
   ```
   par l'ID copié à l'étape précédente, par exemple :
   ```javascript
   const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms';
   ```
4. *(Optionnel)* Renseignez `OWNER_EMAIL` avec votre adresse e-mail pour recevoir une notification à chaque envoi.
5. Enregistrez le projet (Ctrl+S / ⌘S).

---

### 3. Déployer en Web App

1. Cliquez sur **Déployer → Nouveau déploiement**.
2. Type : **Application Web**.
3. Paramètres :
   - **Exécuter en tant que** : Moi
   - **Personnes autorisées à accéder** : Tout le monde (anonyme)
4. Cliquez sur **Déployer** et autorisez les permissions demandées.
5. Copiez l'**URL de l'application Web** affichée (elle ressemble à) :
   ```
   https://script.google.com/macros/s/AKfycb…/exec
   ```

> **Important :** à chaque modification du script, vous devez créer un **nouveau déploiement** (pas "Gérer les déploiements") pour que les changements soient pris en compte.

---

### 4. Configurer le formulaire

1. Ouvrez `index.html` dans un éditeur de texte.
2. Repérez la ligne (dans la balise `<script>`) :
   ```javascript
   const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';
   ```
3. Remplacez `'YOUR_APPS_SCRIPT_WEB_APP_URL'` par l'URL copiée, par exemple :
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb…/exec';
   ```
4. Enregistrez le fichier.

---

### 5. Tester

1. Ouvrez `index.html` dans un navigateur (double-clic ou glisser-déposer dans Chrome/Firefox).
2. Remplissez le formulaire et cliquez sur **Suivant →**.
3. Vérifiez le récapitulatif, puis cliquez sur **Confirmer et envoyer ✓**.
4. Ouvrez votre Google Sheet : une nouvelle ligne doit apparaître avec toutes les données et un horodatage en colonne L.

---

## Checklist de vérification

- [ ] Remplir le formulaire → cliquer **Suivant** → la page de confirmation affiche les bonnes valeurs
- [ ] Cliquer **← Modifier** → le formulaire se rouvre avec toutes les valeurs conservées
- [ ] Soumettre avec un champ requis vide → message d'erreur affiché (pas de passage à l'étape 2)
- [ ] Confirmer → ligne ajoutée dans le sheet avec Timestamp
- [ ] Tester en responsive : 375 px (mobile) et 768 px (tablette) dans les DevTools du navigateur

---

## Champs requis

Les champs marqués d'une astérisque `*` sont obligatoires :
- Nom entreprise
- Nom
- Prénom
- Téléphone
- Email

---

## Dépannage

| Problème | Solution |
|---|---|
| La requête échoue avec une erreur CORS | Vérifiez que l'accès est bien « Tout le monde » dans le déploiement |
| `SHEET_ID` introuvable | L'ID se trouve entre `/d/` et `/edit` dans l'URL du classeur |
| Les données arrivent dans le mauvais ordre | Vérifiez que l'en-tête de la ligne 1 correspond exactement à l'ordre des colonnes ci-dessus |
| Aucun e-mail de notification | Vérifiez `OWNER_EMAIL` et que vous avez autorisé `MailApp` lors du déploiement |

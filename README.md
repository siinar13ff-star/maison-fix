# MaisonFlix Android

Application Android compagnon du serveur MaisonFlix.

## Pré-requis
- Android Studio récent
- Le serveur MaisonFlix lancé sur le PC/NAS
- Téléphone Android connecté au même Wi-Fi

## Installation
1. Ouvrir ce dossier dans Android Studio.
2. Attendre la synchronisation Gradle.
3. Lancer l'application sur un téléphone ou un émulateur.
4. Entrer l'adresse du serveur, par exemple:
   http://192.168.1.100:3000

## Important
Le PC/NAS doit autoriser le port TCP 3000 sur le réseau local.

## Suite possible
Cette version utilise l'interface MaisonFlix dans une WebView afin d'être immédiatement compatible avec le serveur existant. Une version native complète pourra ensuite ajouter:
- Chromecast / Google Cast
- Android TV / télécommande
- téléchargement hors ligne
- profils
- reprise de lecture
- notifications
- affiches et métadonnées automatiques

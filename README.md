### Application Web Développée en Angular avec Firebase : ToDoNest
Une application web développée en Angular qui utilise Firebase comme Backend-as-a-Service (BaaS). Cette application implémente des fonctionnalités d'authentification, de gestion des utilisateurs et de gestion sécurisée des données en utilisant Firebase Authentication et Firestore.

### Fonctionnalités
Fonctionnalités utilisateur :

- Page d'accueil :
Accès à un bouton pour se connecter ou s'inscrire.
- Connexion :
L'utilisateur peut entrer ses informations d'identification pour se connecter.
- Inscription :
Les nouveaux utilisateurs peuvent s'inscrire via un formulaire d'inscription.
- Redirection sécurisée :
Les utilisateurs non inscrits ou non connectés sont redirigés automatiquement s'ils tentent d'accéder à des pages sécurisées.
- Blocage des tentatives de connexion :
Après 3 tentatives de connexion infructueuses, l'utilisateur est temporairement bloqué.
- Architecture
Le projet suit une architecture modulaire et maintenable en respectant les principes S.O.L.I.D :
- Séparation des responsabilités :
Les composants Angular, services Firebase, et la logique métier sont clairement définis et séparés.
- Gestion des états :
Utilisation des services Angular pour une gestion centralisée des données et des états.

### Prérequis
Angular CLI : Installez Angular CLI pour démarrer le projet.

### Exécution du projet :

ng serve

### Auteurs
Maylis Gaillard
CHONG Jong Hoa

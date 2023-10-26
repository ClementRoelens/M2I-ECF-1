# Premier ECF du 26/10/2023 dans le cadre de la formation CDA de M2I commencée le 17/07/2023

https://github.com/ClementRoelens/M2I-ECF-1

# Installation

1. Se placer dans chacun des deux projets (app-back-end et app-front-end) et exécuter la commande 
```
npm i
```


2. Lancer le back-end avec node js/index.js (si vous voulez le modifier, exécutez la commande 
```
tsc --w
``` 
sur un autre terminal que vous laisserez ouvert, puis modifiez les fichiers du répertoire ts)


3. Lancez le front-end avec 
```
npm run dev
```

# Features

- Vous pouvez visualiser la liste des projets déjà créés
    - Un projet terminé apparaît en vert
    - Un projet dont la deadline est passé apparaît en rouge
    - Un projet dont la deadline est aujourd'hui apparaît en jaune
- Vous pouvez ajouter un projet
    - Le statut est par défaut à non-démarré
- Vous pouvez modifier un projet
    - Une validation des données est présente si vous tentez d'envoyer des données inconsistantes
- Vous pouvez utiliser le menu déroulant en haut à gauche de la liste pour filter les projets selon leur statut
- Vous pouvez voir un projet au hasard
- Des logs des requêtes demandées ainsi que leur origine sont disponibles dans 
```
app-back-end/log.txt
``````
- Ne cliquez pas sur la théière
    - (cela ne provoquerait rien de dangereux, mais vous risquez de vous endormir)
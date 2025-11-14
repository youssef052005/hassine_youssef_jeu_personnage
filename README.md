#​‍​‌‍​‍‌ Jeu du Lapin Runner
## Description
Lapin Runner est un mini-jeu dans lequel un lapin court automatiquement et chaque fois que vous appuyez sur une touche, le lapin doit décider s’il va sauter au-dessus d’un rocher ou
s’accroupir pour passer sous un oiseau. Votre score, basé sur la distance parcourue et le nombre d’obstacles évités, s’affiche à l’écran en temps réel.
## Technologies utilisées
- HTML5 (structure)
- CSS3 (design, animations)
- JavaScript pur (logique, DOM, événements clavier)
## Fonctionnalités principales
- Le lapin court automatiquement.
- Touche Espace ou Flèche Haut : pour demander au lapin de sauter.
- Touche Flèche Bas : pour permettre au lapin de s’accroupir.
- Sur la droite de l’écran, des obstacles apparaissent au hasard : un rocher pour être évité en sautant ou un oiseau pour passer dessous en s’accroupissant.
- Vous ne verrez jamais simultanément un rocher et un oiseau ! On a quand même un minimum de fair-play ;) .
- Un fond qui défile donnant l’impression que notre lapin court sur une prairie.
- Si jamais le lapin percute un obstacle c’est la fin, le lapin s’arrête de courir et le menu Home s’affiche pour vous proposer de rejouer.
- Votre score s’affiche en temps réel et il est possible de rejouer en appuyant sur le bouton « Rejouer » !
##  Lien vers le rendu final
[Voir le jeu en ligne](https://youssef052005.github.io/hassine_youssef_jeu_personnage/)
##  Nouveautés explorées
- Utilisation d’animations CSS (`@keyframes`) pour le fond défilant et l’apparition des obstacles.
- Utilisation des événements clavier pour décider de la touche à appuyer pour le joueur (`keydown`, `keyup`).
- Manipulation du DOM et création dynamique d’éléments (`createElement`, `appendChild`, `removeChild`) et suppression de ceux-ci.
- Logique pour empêcher qu’un rocher et un oiseau apparaissent en même temps.
- Ajustement visuel pour que le personnage, les obstacles et le sol s’alignent.
- Création de hitbox et son adjustement.
##  Difficultés rencontrées
Pendant le développement
- Synchroniser les animations CSS et la suppression de l’élément obstacle en JavaScript.
- Visuellement aligner le lapin, les rochers, les oiseaux et la terre pour que le jeu soit plus fluide.
- Gérer les états du jeu : le personnage qui saute, le personnage qui s’accroupit, personnage qui évite un obstacle, personnage qui touche l’obstacle et Fin du jeu.
-Détection des collisions : ajuster la hitbox du lapin et des obstacles pour que les collisions soient justes et naturelles. 
- Assurer la compatibilité entre navigateurs (performance, animations fluides).
## Solutions apportées
- Utilisation de l’événement `animationend` pour retirer un obstacle exactement à la fin de l’animation.
- Ajuster les propriétés CSS de positionnement (`bottom`, `top`) et les dimensions pour que tout s’aligne.
- Utilisation de variables d’état (`isJumping`, `isCrouching`, etc.)pour gérer les différentes actions du personnage.
-Création de hitbox personnalisées via getBoundingClientRect() et ajustement manuel des zones de collision pour plus de précision.
- Tests réguliers et mise en place pour sauvegarder mes progrès en cas de problème.
---
*Projet réalisé par Youssef Hassine

*Date de rendu : [14/11/2025] ​‍​‌‍​‍‌
*Projet réalisé par Youssef Hassine
*Date de rendu : [14/11/2025] ​‍​‌‍​‍‌

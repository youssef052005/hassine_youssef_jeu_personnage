const rabbit = document.getElementById("rabbit");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const musicBtn = document.getElementById("musicBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const startMenu = document.getElementById("startMenu");
const startBtn = document.getElementById("startBtn");

let isJumping = false;
let isCrouching = false;
let jumpStartTime = null;
const jumpHeight = 150;
const jumpDuration = 600;
let baseBottom = parseInt(window.getComputedStyle(rabbit).bottom);
let jumpKeyPressed = false;
let score = 0;
let gameOver = false;
let gameStarted = false;
let obstacleTimeout = null;
let collisionInterval = null;
let bestScore = localStorage.getItem("bestScore") || 0;
let musicPlaying = false;
let runAnimationInterval = null;
let gameSpeed = 1; // Vitesse du jeu (1 = normal)

// Créer l'élément audio pour la musique
const bgMusic = new Audio("music/background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

// Gérer les erreurs de chargement audio
bgMusic.addEventListener('error', () => {
 console.log("Fichier audio non trouvé. Mets un fichier MP3 dans le dossier 'music'");
});

// Animation de course du lapin
const runFrames = [
 "url('images/lapin_normal1.png')",
 "url('images/lapin_normal2.png')",
 "url('images/lapin_normal.png')",
 "url('images/lapin_courant.png')"
];
const crouchRunFrames = [
 "url('images/lapin_accroupit.png')",
 "url('images/lapin_accroupit3.png')",
 "url('images/lapin_accroupit1.png')"
];
let currentFrame = 0;
let currentCrouchFrame = 0;

function animateRabbitRun() {
 if (!gameOver && gameStarted && !isJumping) {
  if (isCrouching) {
   currentCrouchFrame = (currentCrouchFrame + 1) % crouchRunFrames.length;
   rabbit.style.backgroundImage = crouchRunFrames[currentCrouchFrame];
  } else {
   currentFrame = (currentFrame + 1) % runFrames.length;
   rabbit.style.backgroundImage = runFrames[currentFrame];
  }
 }
}

// Afficher le meilleur score au chargement
if (bestScoreDisplay) {
 bestScoreDisplay.textContent = "Meilleur : " + bestScore;
} 

function startGame() {
 gameStarted = true;
 startMenu.style.display = "none";
 
 // Démarrer l'animation de course
 runAnimationInterval = setInterval(animateRabbitRun, 150);
 
 obstacleTimeout = setTimeout(createObstacle, 800);
 updateScore();
 collisionInterval = setInterval(checkCollision, 50);
}

startBtn.addEventListener("click", startGame);

// Gestion du bouton musique
if (musicBtn) {
 musicBtn.addEventListener("click", () => {
  if (musicPlaying) {
   bgMusic.pause();
   musicBtn.textContent = "🔇";
   musicBtn.classList.add("muted");
   musicPlaying = false;
  } else {
   bgMusic.play();
   musicBtn.textContent = "🎵";
   musicBtn.classList.remove("muted");
   musicPlaying = true;
  }
 });
}

document.addEventListener("keydown", (e) => {
 if (!gameStarted || gameOver) return;
 
 if ((e.code === "ArrowUp" || e.code === "Space") && !jumpKeyPressed) {
  jumpKeyPressed = true;
  if (!isJumping) jump();
 } else if (e.code === "ArrowDown" && !isJumping && !isCrouching) {
  isCrouching = true;
  rabbit.classList.add("crouch");
  currentCrouchFrame = 0;
  rabbit.style.backgroundImage = crouchRunFrames[0];
 }
});

document.addEventListener("keyup", (e) => {
 if (!gameStarted || gameOver) return;

 if (e.code === "ArrowDown" && isCrouching) {
  isCrouching = false;
  rabbit.classList.remove("crouch");
  currentFrame = 0;
 }
 if (e.code === "ArrowUp" || e.code === "Space") jumpKeyPressed = false;
});

function jump(timestamp) {
 if (isJumping) return;
 isJumping = true;
 rabbit.classList.remove("crouch");
 rabbit.classList.add("jump");
 rabbit.style.backgroundImage = "url('images/lapin_courant.png')";
 isCrouching = false;
 jumpStartTime = null;
 requestAnimationFrame(animateJump);
}

function animateJump(timestamp) {
 if (!jumpStartTime) jumpStartTime = timestamp;
 const elapsed = timestamp - jumpStartTime;
 const progress = Math.min(elapsed / jumpDuration, 1);
 const bottom = baseBottom + jumpHeight * Math.sin(progress * Math.PI);
 rabbit.style.bottom = bottom + "px";
 if (progress < 1) {
  requestAnimationFrame(animateJump);
 } else {
  rabbit.style.bottom = baseBottom + "px";
  isJumping = false;
  rabbit.classList.remove("jump");
  if (isCrouching) {
   rabbit.classList.add("crouch");
   currentCrouchFrame = 0;
   rabbit.style.backgroundImage = crouchRunFrames[0];
  } else {
   currentFrame = 0;
  }
 }
}

function createObstacle() {
 if (gameOver || !gameStarted) return;
 
 const type = Math.random() < 0.5 ? "rock" : "bird";
 spawnOfType(type);
 
 // Réduire le délai entre les obstacles en fonction de la vitesse
 const baseDelay = 900 + Math.random() * 700;
 const adjustedDelay = baseDelay / gameSpeed;
 obstacleTimeout = setTimeout(createObstacle, adjustedDelay);
}

function spawnOfType(type) {
 if (gameOver) return;

 const el = document.createElement("div");
 el.classList.add(type === "rock" ? "obstacle" : "bird");

 // Ajuster la durée d'animation en fonction de la vitesse
 const baseDuration = 3;
 const adjustedDuration = baseDuration / gameSpeed;
 el.style.animationDuration = adjustedDuration + "s";

 if (type === "rock") {
  el.style.bottom = "20px";
 } else {
  let frame = 0;
  const birdFrames = ["url('images/oiseau.png')", "url('images/oiseau_vol.png')"];
  el.style.backgroundImage = birdFrames[0];
  const flapInterval = setInterval(() => {
   frame = (frame + 1) % 2;
   el.style.backgroundImage = birdFrames[frame];
  }, 200);
  el.addEventListener("animationend", () => clearInterval(flapInterval));
 }

 el.addEventListener("animationend", () => {
  if (game.contains(el)) game.removeChild(el);
 });
 
 game.appendChild(el);
}

function checkCollision() {
 if (gameOver || !gameStarted) return;
 const rabbitBox = getRabbitHitboxCenter();
 const obstacles = document.querySelectorAll(".obstacle, .bird");

 obstacles.forEach((el) => {
  const obsRect = el.getBoundingClientRect();

  if (el.classList.contains("obstacle")) {
   const radius = obsRect.width / 2;
   const obsCenterX = obsRect.left + radius;
   const obsCenterY = obsRect.top + radius;
   const dx = rabbitBox.x - obsCenterX;
   const dy = rabbitBox.y - obsCenterY;
   if (Math.sqrt(dx*dx + dy*dy) < radius) endGame();
  } else {
   const obsHitbox = {
    left: obsRect.left + 25,
    right: obsRect.right - 35,
    top: obsRect.top + 15,
    bottom: obsRect.bottom - 10
   };
   if (
    rabbitBox.x + rabbitBox.width/2 > obsHitbox.left &&
    rabbitBox.x - rabbitBox.width/2 < obsHitbox.right &&
    rabbitBox.y + rabbitBox.height/2 > obsHitbox.top &&
    rabbitBox.y - rabbitBox.height/2 < obsHitbox.bottom
   ) endGame();
  }
 });
}

function getRabbitHitboxCenter() {
 const rect = rabbit.getBoundingClientRect();
 let hitboxWidth = 80;
 let hitboxHeight = 90;
 
 // Réduire la hauteur de la hitbox quand le lapin est accroupi
 if (isCrouching) {
  hitboxHeight = 50; // Hitbox plus petite en hauteur
 }
 
 const centerX = rect.left + rect.width / 2;
 const centerY = rect.bottom - hitboxHeight / 2;
 return { x: centerX, y: centerY, width: hitboxWidth, height: hitboxHeight };
}

function endGame() {
 if (gameOver) return;
 gameOver = true;
 
 // Arrêter l'animation de course
 if (runAnimationInterval) clearInterval(runAnimationInterval);
 
 // Vérifier et sauvegarder le meilleur score
 if (score > bestScore) {
  bestScore = score;
  localStorage.setItem("bestScore", bestScore);
  bestScoreDisplay.textContent = "Meilleur : " + bestScore;
 }
 
 // Arrêter toutes les animations du lapin
 rabbit.classList.remove("jump", "crouch");
 rabbit.classList.add("frozen");
 
 // Arrêter l'animation du background
 game.classList.add("frozen");
 
 // Arrêter toutes les animations des obstacles
 const obstacles = document.querySelectorAll(".obstacle, .bird");
 obstacles.forEach(obs => obs.style.animationPlayState = "paused");
 
 finalScore.textContent = "Ton score : " + score;
 gameOverScreen.style.display = "flex";
}

restartBtn.addEventListener("click", () => {
 // Arrêter tous les timers en cours
 if (obstacleTimeout) clearTimeout(obstacleTimeout);
 if (collisionInterval) clearInterval(collisionInterval);
 if (runAnimationInterval) clearInterval(runAnimationInterval);
 
 // Réinitialiser toutes les variables
 gameOver = false;
 gameStarted = true;
 score = 0;
 gameSpeed = 1; // Réinitialiser la vitesse
 isJumping = false;
 isCrouching = false;
 jumpKeyPressed = false;
 currentFrame = 0;
 currentCrouchFrame = 0;
 
 // Réinitialiser l'affichage
 scoreDisplay.textContent = "Score : 0";
 gameOverScreen.style.display = "none";
 startMenu.style.display = "none";
 
 // Nettoyer les obstacles existants
 const obstacles = document.querySelectorAll(".obstacle, .bird");
 obstacles.forEach(obs => obs.remove());
 
 // Réinitialiser le lapin
 rabbit.classList.remove("frozen", "jump", "crouch");
 rabbit.style.bottom = baseBottom + "px";
 rabbit.style.backgroundImage = runFrames[0];
 
 // Réactiver l'animation du jeu
 game.classList.remove("frozen");
 game.style.animationDuration = "8s"; // Réinitialiser la vitesse du background
 
 // Relancer le jeu
 runAnimationInterval = setInterval(animateRabbitRun, 150);
 obstacleTimeout = setTimeout(createObstacle, 800);
 collisionInterval = setInterval(checkCollision, 50);
 updateScore();
});

function updateScore() {
 if (!gameOver && gameStarted) {
  score++;
  scoreDisplay.textContent = "Score : " + score;
  
  // Augmenter progressivement la vitesse tous les 100 points
  // Maximum de 2x la vitesse normale
  gameSpeed = Math.min(1 + (score / 500), 2);
  
  // Accélérer l'animation du background
  const baseAnimDuration = 8;
  const adjustedAnimDuration = baseAnimDuration / gameSpeed;
  game.style.animationDuration = adjustedAnimDuration + "s";
  
  setTimeout(updateScore, 200);
 } else if (!gameStarted) {
  setTimeout(updateScore, 50); 
 }
}

updateScore();
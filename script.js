const rabbit = document.getElementById("rabbit");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
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

function startGame() {
 gameStarted = true;
 startMenu.style.display = "none";
 
 setTimeout(createObstacle, 800);
 updateScore();
 setInterval(checkCollision, 50);
}

startBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
 if (!gameStarted) return;
 
 if ((e.code === "ArrowUp" || e.code === "Space") && !jumpKeyPressed) {
  jumpKeyPressed = true;
  if (!isJumping) jump();
 } else if (e.code === "ArrowDown" && !isJumping && !isCrouching) {
  isCrouching = true;
  rabbit.classList.add("crouch");
 }
});

document.addEventListener("keyup", (e) => {
 if (!gameStarted) return;

 if (e.code === "ArrowDown" && isCrouching) {
  isCrouching = false;
  rabbit.classList.remove("crouch");
 }
 if (e.code === "ArrowUp" || e.code === "Space") jumpKeyPressed = false;
});

function jump(timestamp) {
 if (isJumping) return;
 isJumping = true;
 rabbit.classList.remove("crouch");
 rabbit.classList.add("jump");
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
  if (isCrouching) rabbit.classList.add("crouch");
 }
}

function createObstacle() {
 if (gameOver || !gameStarted) return;
 
 const type = Math.random() < 0.5 ? "rock" : "bird";
 spawnOfType(type);
 
 const next = 900 + Math.random() * 700;
 setTimeout(createObstacle, next);
}

function spawnOfType(type) {
 if (gameOver) return;

 const el = document.createElement("div");
 el.classList.add(type === "rock" ? "obstacle" : "bird");

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
 const hitboxWidth = 80;
 const hitboxHeight = 90;
 const centerX = rect.left + rect.width / 2;
 const centerY = rect.bottom - hitboxHeight / 2;
 return { x: centerX, y: centerY, width: hitboxWidth, height: hitboxHeight };
}

function endGame() {
 if (gameOver) return;
 gameOver = true;
 finalScore.textContent = "Ton score : " + score;
 gameOverScreen.style.display = "flex";
}

restartBtn.addEventListener("click", () => location.reload());

function updateScore() {
 if (!gameOver && gameStarted) {
  score++;
  scoreDisplay.textContent = "Score : " + score;
  setTimeout(updateScore, 200);
 } else if (!gameStarted) {
  setTimeout(updateScore, 50); 
 }
}

updateScore();
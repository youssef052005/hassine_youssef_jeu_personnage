const rabbit = document.getElementById("rabbit");
const game = document.getElementById("game");

let isJumping = false;
let isCrouching = false;
let jumpStartTime = null;

const jumpHeight = 150;
const jumpDuration = 600;
let baseBottom = parseInt(window.getComputedStyle(rabbit).bottom);

let jumpKeyPressed = false;
document.addEventListener("keydown", (e) => {
  if ((e.code === "ArrowUp" || e.code === "Space") && !jumpKeyPressed) {
    jumpKeyPressed = true;
    if (!isJumping) jump();
  } else if (e.code === "ArrowDown" && !isJumping && !isCrouching) {
    isCrouching = true;
    rabbit.classList.add("crouch");
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown" && isCrouching) {
    isCrouching = false;
    rabbit.classList.remove("crouch");
  }
  if (e.code === "ArrowUp" || e.code === "Space") {
    jumpKeyPressed = false; 
  }
});

function jump(timestamp) {
  if (isJumping) return;
  isJumping = true;
  rabbit.classList.remove("crouch");
  isCrouching = false;
  jumpStartTime = null;
  requestAnimationFrame(animateJump);
}

function animateJump(timestamp) {
  if (!jumpStartTime) jumpStartTime = timestamp;
  const elapsed = timestamp - jumpStartTime;
  const progress = elapsed / jumpDuration;
  const bottom = baseBottom + jumpHeight * Math.sin(progress * Math.PI);
  rabbit.style.bottom = bottom + "px";

  if (progress < 1) {
    requestAnimationFrame(animateJump);
  } else {
    rabbit.style.bottom = baseBottom + "px";
    isJumping = false;
  }
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  game.appendChild(obstacle);

  const animationDuration = 3000;
  setTimeout(() => {
    if (game.contains(obstacle)) game.removeChild(obstacle);
  }, animationDuration);

  const randomTime = Math.random() * 2000 + 1000;
  setTimeout(createObstacle, randomTime);
}

createObstacle();

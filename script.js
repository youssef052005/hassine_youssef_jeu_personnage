const rabbit = document.getElementById("rabbit");
const game = document.getElementById("game");

let isJumping = false;
let jumpStartTime = null;
const jumpHeight = 150;
const jumpDuration = 600;

document.addEventListener("keydown", (e) => {
  if ((e.code === "ArrowUp" || e.code === "Space") && !isJumping) {
    jump();
  } else if (e.code === "ArrowDown" && !isJumping) {
    rabbit.classList.add("crouch");
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown") {
    rabbit.classList.remove("crouch");
  }
});

function jump(timestamp) {
  if (!isJumping) {
    isJumping = true;
    rabbit.classList.remove("crouch");
    jumpStartTime = null;
    requestAnimationFrame(animateJump);
  }
}

function animateJump(timestamp) {
  if (!jumpStartTime) jumpStartTime = timestamp;
  const elapsed = timestamp - jumpStartTime;
  const progress = elapsed / jumpDuration;
  const bottom = 40 + jumpHeight * Math.sin(progress * Math.PI);
  rabbit.style.bottom = bottom + "px";

  if (progress < 1) {
    requestAnimationFrame(animateJump);
  } else {
    rabbit.style.bottom = "40px";
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

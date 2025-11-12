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
  rabbit.classList.add("jump")
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
let currentType = null;    
let activeCount = 0;    

function createObstacle() {
  const chosenType = Math.random() < 0.5 ? "rock" : "bird";

  if (currentType === null || currentType === chosenType) {
    spawnOfType(chosenType);
  } else {
    const retryDelay = 500 + Math.random() * 800;
    setTimeout(createObstacle, retryDelay);
    return;
  }
  const next = 800 + Math.random() * 800;
  setTimeout(createObstacle, next);
}

function spawnOfType(type) {
  const el = document.createElement("div");
  if (type === "rock") {
    el.classList.add("obstacle");
    el.style.bottom = "20px"; 
  } else {
    el.classList.add("bird");
  }

  if (currentType === null) currentType = type;
  activeCount++;

  
  const animationDuration = 3000; 
  game.appendChild(el);
  const removeFn = () => {
    if (game.contains(el)) game.removeChild(el);
    activeCount--;
    if (activeCount <= 0) {
      currentType = null;
      activeCount = 0;
    }
    el.removeEventListener("animationend", removeFn);
  };

  el.addEventListener("animationend", removeFn);

  setTimeout(() => {
    if (game.contains(el)) {
      game.removeChild(el);
      activeCount--;
      if (activeCount <= 0) {
        currentType = null;
        activeCount = 0;
      }
    }
  }, animationDuration + 100);

  return el;
}

setTimeout(createObstacle, 800);

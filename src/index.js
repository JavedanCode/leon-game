import "./styles.css";
import createCanvas from "./canvas";

const canvas = createCanvas();

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const groundHeight = 50;

const groundLevel = canvas.height - groundHeight;

let gameSpeed = 3;

let obstacles = [];

let distanceSinceLastSpawn = 0;

let canJump = true;

let gameOver = false;

let score = 0;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (player.vy === 0) {
      player.vy = player.jumpSpeed;
      canJump = false;
    }
  }
});

const gapChances = [
  { gap: 450, weight: 0.5 }, // 50%
  { gap: 350, weight: 0.3 }, // 30%
  { gap: 400, weight: 0.2 }, // 20%
];

let ground1 = {
  x: 0,
  y: canvas.height - groundHeight,
  width: canvas.width,
  height: groundHeight,
};

let ground2 = {
  x: canvas.width,
  y: canvas.height - groundHeight,
  width: canvas.width,
  height: groundHeight,
};

function Obstacle() {
  return {
    x: canvas.width,
    y: canvas.height - groundHeight - 40,
    width: 40,
    height: 40,
  };
}

function getRandomGap() {
  let rand = Math.random();
  let sum = 0;

  for (let i = 0; i < gapChances.length; i++) {
    sum += gapChances[i].weight;
    if (rand < sum) {
      return gapChances[i].gap;
    }
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

let nextSpawnDistance = getRandomGap();

const player = {
  x: 400,
  y: canvas.height - 2 * groundHeight,
  width: 50,
  height: 50,
  jumpSpeed: -30,
  gravity: 1,
  vy: 0,
};
function update() {
  ground1.x -= gameSpeed;
  ground2.x -= gameSpeed;

  if (ground1.x + ground1.width < 0) {
    ground1.x = ground2.x + ground2.width;
  }

  if (ground2.x + ground2.width < 0) {
    ground2.x = ground1.x + ground1.width;
  }

  distanceSinceLastSpawn += gameSpeed;

  if (distanceSinceLastSpawn >= nextSpawnDistance) {
    obstacles.push(Obstacle());

    distanceSinceLastSpawn = 0;
    nextSpawnDistance = getRandomGap();
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= gameSpeed;
  }

  obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);

  score++;

  player.vy += player.gravity;
  player.y += player.vy;

  if (player.y + player.height >= groundLevel) {
    player.y = groundLevel - player.height;
    player.vy = 0;
    canJump = true;
  }

  for (let obs of obstacles) {
    if (isColliding(obs, player)) {
      gameOver = true;
      return;
    }
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 40, 40);

  ctx.fillStyle = "red";
  ctx.fillRect(ground1.x, ground1.y, ground1.width, ground1.height);
  ctx.fillStyle = "green";

  ctx.fillRect(ground2.x, ground2.y, ground2.width, ground2.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "yellow";

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "60px arial bold";
    ctx.textAlign = "center";
    ctx.fillText("Game over", canvas.width / 2, canvas.height / 2);
  }
}
function gameLoop() {
  if (gameOver) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

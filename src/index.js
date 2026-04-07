import "./styles.css";
import createCanvas from "./canvas";

const canvas = createCanvas();

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const groundHeight = 50;

const groundLevel = canvas.height - groundHeight;

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

let obstacles = [];

function Obstacle() {
  return {
    x: canvas.width,
    y: canvas.height - groundHeight - 40,
    width: 40,
    height: 40,
  };
}

let gameSpeed = 3;

const gapChances = [
  { gap: 450, weight: 0.5 }, // 50%
  { gap: 350, weight: 0.3 }, // 30%
  { gap: 400, weight: 0.2 }, // 20%
];

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

let distanceSinceLastSpawn = 0;
let nextSpawnDistance = getRandomGap();

const player = {
  x: 400,
  y: canvas.height - 2 * groundHeight,
  width: 50,
  height: 50,
  jumpSpeed: -14,
  gravity: -8,
  verticalVelocity: 0,
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

  player.vy += player.gravity;
  player.y += player.vy;

  if (player.y + player.height > groundLevel) {
    player.y = groundLevel - player.height;
    player.vy = 0;
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // let num = Math.random();
  // if (num < 0.3) {
  //
  // } else if (num > 0.33 && num < 0.66) {
  //   ctx.fillStyle = "blue";
  // } else {
  //   ctx.fillStyle = "red";
  // }
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
}
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

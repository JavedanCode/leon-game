import "./styles.css";
import createCanvas from "./canvas";
import walk1 from "./sprites/w1.png";
import walk2 from "./sprites/w2.png";
import walk3 from "./sprites/w3.png";
import walk4 from "./sprites/w4.png";
import walk5 from "./sprites/w5.png";
import walk6 from "./sprites/w6.png";
import ashley1 from "./sprites/a1.png";
import ashley2 from "./sprites/a2.png";
import ashley3 from "./sprites/a3.png";
import ashley4 from "./sprites/a4.png";
import ashley from "./sprites/ashley.png";

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

let animationCounter = 0;

const spriteOffsetY = -10; // adjust this

const spriteHeight = 120;
const spriteWidth = 80;

const ashleyGameOver = loadImage(ashley);

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const walkSprites = [
  loadImage(walk1),
  loadImage(walk2),
  loadImage(walk3),
  loadImage(walk4),
  loadImage(walk5),
  loadImage(walk6),
];
const ashleySprites = [
  loadImage(ashley1),
  loadImage(ashley2),
  loadImage(ashley3),
  loadImage(ashley4),
];
const player = {
  x: 400,
  y: groundLevel - 50,

  hitbox: {
    width: 40,
    height: 60,
    offsetX: 20,
    offsetY: 70,
  },

  width: spriteWidth,
  height: spriteHeight,

  jumpSpeed: -35,
  gravity: 1,
  vy: 0,
  sprite: walkSprites[0],
};
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (canJump) {
      player.vy = player.jumpSpeed;
      canJump = false;
    }
  }
});

const gapChances = [
  { gap: 500, weight: 0.5 }, // 50%
  { gap: 450, weight: 0.3 }, // 30%
  { gap: 600, weight: 0.2 }, // 20%
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
    y: canvas.height - groundHeight - spriteHeight,
    width: spriteWidth,
    height: spriteHeight,
    sprite: ashleySprites[0],
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

function getHitbox(entity) {
  return {
    x: entity.x + entity.hitbox.offsetX,
    y: entity.y + entity.hitbox.offsetY,
    width: entity.hitbox.width,
    height: entity.hitbox.height,
  };
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
    if (isColliding(obs, getHitbox(player))) {
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

  ctx.fillStyle = "yellow";

  animationCounter++;

  ctx.drawImage(
    player.sprite,
    player.x,
    player.y - spriteOffsetY,
    player.width,
    player.height + spriteOffsetY,
  );
  ctx.strokeStyle = "red";
  ctx.strokeRect(player.x, player.y, player.width, player.height);
  if (animationCounter < 20) {
    player.sprite = walkSprites[0];
  } else if (animationCounter < 40) {
    player.sprite = walkSprites[1];
  } else if (animationCounter < 60) {
    player.sprite = walkSprites[2];
  } else if (animationCounter < 80) {
    player.sprite = walkSprites[3];
  } else if (animationCounter < 100) {
    player.sprite = walkSprites[4];
  } else if (animationCounter < 120) {
    player.sprite = walkSprites[5];
  } else {
    animationCounter = 0;
  }

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    ctx.drawImage(obs.sprite, obs.x, obs.y, obs.width, obs.height);
    if (animationCounter < 20) {
      obs.sprite = ashleySprites[0];
    } else if (animationCounter < 40) {
      obs.sprite = ashleySprites[1];
    } else if (animationCounter < 60) {
      obs.sprite = ashleySprites[2];
    } else if (animationCounter < 80) {
      obs.sprite = ashleySprites[3];
    } else {
      animationCounter = 0;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "60px arial bold";
    ctx.textAlign = "center";
    ctx.drawImage(
      ashleyGameOver,
      canvas.width / 2 - 50,
      canvas.height / 2 - 250,
      100,
      200,
    );
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

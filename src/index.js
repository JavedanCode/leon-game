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
import crow from "./sprites/c1.png";
import ashley from "./sprites/ashley.png";
import ground from "./sprites/ground.png";
import background from "./sprites/background.png";

const canvas = createCanvas();

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const groundHeight = 50;

const groundLevel = canvas.height - groundHeight;

let gameSpeed = 2.3;

let obstacles = [];

let distanceSinceLastSpawn = 0;

let distanceSinceLastCrowSpawn = 0;

let canJump = true;

let gameOver = false;

let score = 0;

let animationCounter = 0;

const spriteOffsetY = -10;

const spriteHeight = 120;
const spriteWidth = 80;

const ashleyGameOver = loadImage(ashley);

const backgroundImage = loadImage(background);

function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}

function resetGame() {
  obstacles = [];
  score = 0;
  gameOver = false;
  distanceSinceLastSpawn = 0;
  nextSpawnDistance = getRandomGap();
  gameSpeed = 2.3;

  player.y = groundLevel - player.height;
  player.vy = 0;
  canJump = true;

  animationCounter = 0;
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

const crowSprite = loadImage(crow);

const player = {
  x: 400,
  y: groundLevel - 50,

  hitbox: {
    width: 5,
    height: 50,
    offsetX: 30,
    offsetY: 50,
  },

  width: spriteWidth,
  height: spriteHeight,

  jumpSpeed: -21.6,
  gravity: 0.8,
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

canvas.addEventListener("click", (e) => {
  if (!gameOver) return;

  const rect = canvas.getBoundingClientRect();

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const buttonX = canvas.width / 2 - 100;
  const buttonY = canvas.height / 2 + 50;
  const buttonWidth = 200;
  const buttonHeight = 60;

  if (
    mouseX >= buttonX &&
    mouseX <= buttonX + buttonWidth &&
    mouseY >= buttonY &&
    mouseY <= buttonY + buttonHeight
  ) {
    resetGame();
    requestAnimationFrame(gameLoop); // restart loop
  }
});

const gapChances = [
  { gap: 600, weight: 0.5 },
  { gap: 700, weight: 0.3 },
  { gap: 800, weight: 0.2 },
];

const crowGapChances = [
  {
    gap: 900,
    weight: 0.5,
  },
  {
    gap: 1200,
    weight: 0.3,
  },
  {
    gap: 1500,
    weight: 0.2,
  },
];

let ground1 = {
  type: "ground",
  x: 0,
  y: canvas.height - groundHeight,
  width: canvas.width,
  height: groundHeight,
  sprite: loadImage(ground),
};

let ground2 = {
  type: "ground",
  x: canvas.width,
  y: canvas.height - groundHeight,
  width: canvas.width,
  height: groundHeight,
  sprite: loadImage(ground),
};

function Obstacle() {
  return {
    type: "ashley",
    x: canvas.width,
    y: canvas.height - groundHeight - spriteHeight,
    width: spriteWidth,
    height: spriteHeight,
    sprite: ashleySprites[0],
  };
}

function FlyingObstacle() {
  return {
    type: "crow",
    x: canvas.width,
    y: canvas.height / 2 - 157,
    width: spriteWidth,
    height: spriteHeight,
    sprite: crowSprite,
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

function getCrowRandomGap() {
  let rand = Math.random();
  let sum = 0;

  for (let i = 0; i < crowGapChances.length; i++) {
    sum += crowGapChances[i].weight;
    if (rand < sum) {
      return crowGapChances[i].gap;
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
let nextCrowSpawnDistance = getCrowRandomGap();

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

  if (score > 3000) {
    distanceSinceLastCrowSpawn += gameSpeed;
    if (distanceSinceLastCrowSpawn >= nextCrowSpawnDistance) {
      obstacles.push(FlyingObstacle());

      distanceSinceLastCrowSpawn = 0;
      nextCrowSpawnDistance = getCrowRandomGap();
    }
  }

  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].type === "ashley") {
      obstacles[i].x -= gameSpeed;
    } else {
      obstacles[i].x -= gameSpeed + 4;
    }
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
  gameSpeed += 0.001;
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 40, 40);

  ctx.drawImage(
    ground1.sprite,
    ground1.x,
    ground1.y,
    ground1.width,
    ground1.height,
  );

  ctx.drawImage(
    ground2.sprite,
    ground2.x,
    ground2.y,
    ground2.width,
    ground2.height,
  );

  animationCounter++;

  ctx.drawImage(
    player.sprite,
    player.x,
    player.y - spriteOffsetY,
    player.width,
    player.height + spriteOffsetY,
  );

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
    if (animationCounter < 30 && obs.type === "ashley") {
      obs.sprite = ashleySprites[0];
    } else if (animationCounter < 60 && obs.type === "ashley") {
      obs.sprite = ashleySprites[1];
    } else if (animationCounter < 90 && obs.type === "ashley") {
      obs.sprite = ashleySprites[2];
    } else if (animationCounter < 110 && obs.type === "ashley") {
      obs.sprite = ashleySprites[3];
    } else if (animationCounter < 140 && obs.type === "ashley") {
      animationCounter = 30;
    }
  }

  if (gameOver) {
    const button = {
      x: canvas.width / 2 - 100,
      y: canvas.height / 2 + 50,
      width: 200,
      height: 60,
    };

    // draw button
    ctx.fillStyle = "#222";
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.strokeStyle = "white";
    ctx.strokeRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "white";
    ctx.font = "30px arial";
    ctx.textAlign = "center";
    ctx.fillText("Restart", canvas.width / 2, button.y + 40);
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

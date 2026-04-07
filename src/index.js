import "./styles.css";
import createCanvas from "./canvas";

const canvas = createCanvas();

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

const groundHeight = 50;

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

function createObstacle() {
  return {
    x: canvas.width, // start from right
    y: canvas.height - groundHeight - 40, // sit on ground
    width: 40,
    height: 40,
  };
}

let gameSpeed = 3;

let spawnTimer = 0;

const player = {
  x: 100,
  y: canvas.height - 2 * groundHeight,
  width: 50,
  height: 50,
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
}
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

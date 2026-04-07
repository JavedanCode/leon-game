import "./styles.css";
import createCanvas from "./canvas";

const canvas = createCanvas();

document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
};
function update() {
  // nothing yet
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "deepskyblue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

export default function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "game-canvas";
  canvas.width = 1200;
  canvas.height = 688;

  return canvas;
}

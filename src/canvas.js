export default function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "game-canvas";
  canvas.width = 1600;
  canvas.height = 680;

  return canvas;
}

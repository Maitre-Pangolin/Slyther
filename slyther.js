//import Snake from "./mods/snake.mjs";

import Game from "./mods/game.mjs";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let game = new Game(canvas);

game.snakeInitialization();
game.setBackground();
game.internalToVisual();
document.addEventListener("keydown", (e) => game.keyDownHandler(e), false);
document.addEventListener("keyup", (e) => game.keyUpHandler(e), false);
canvas.addEventListener("click", () => game.clickHandler(), false);
let fps = 0;
let prevTime = 0;

function draw(timeStamp) {
  game.runRound();
  fps = Math.round(1000 / (timeStamp - prevTime));
  prevTime = timeStamp;
  ctx.fillText(`FPS : ${fps}`, 10, 10);
  requestAnimationFrame(draw);
}

draw(0);

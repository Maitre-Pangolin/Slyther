import Game from "./mods/game.mjs";

const canvas = document.getElementById("myCanvas");
canvas.style.width = "900px";
canvas.style.height = "900px";
const ctx = canvas.getContext("2d");

let game = new Game(canvas);

document.addEventListener("keydown", (e) => game.keyDownHandler(e), false);
document.addEventListener("keyup", (e) => game.keyUpHandler(e), false);
canvas.addEventListener("click", () => game.clickHandler(), false);
let fps = 0;
let prevTime = 0;
sessionStorage.setItem("test", "Waow incredible");
sessionStorage.setItem(
  "test2",
  JSON.stringify({
    playerNumber: 5,
    players: [{ color: "blue" }, { color: "red" }],
  })
);

game.runGame();

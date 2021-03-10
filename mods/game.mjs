import Snake from "./snake.mjs";

export default class Game {
  constructor(canvas) {
    this.internalCanvas = document.createElement("canvas");
    this.internalCanvas.height = canvas.height;
    this.internalCanvas.width = canvas.width;
    this.canvas = canvas;
    this.ictx = this.internalCanvas.getContext("2d");
    this.ctx = canvas.getContext("2d");
    this.snakes = [];
  }

  setBackground() {
    const backgroundColor = "#001427";
    this.ictx.fillStyle = backgroundColor;
    this.ictx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  snakeInitialization() {
    const player_colors = [
      "#f94144",
      "#f3722c",
      "#f8961e",
      "#f9c74f",
      "#90be6d",
      "#43aa8b",
      "#577590",
    ];

    this.snakes = [
      new Snake(
        "ArrowLeft",
        "ArrowDown",
        player_colors[Math.floor(Math.random() * player_colors.length)],
        this.canvas
      ),
      new Snake("q", "w", "#f94144", this.canvas),
    ];
  }

  clickHandler() {
    for (let snake of this.snakes) {
      snake.reset(this.canvas);
    }
    this.setBackground();
  }

  keyDownHandler(event) {
    for (let snake of this.snakes) {
      if (event.key === snake.keyleft) snake.isTurningLeft = true;
      if (event.key === snake.keyright) snake.isTurningRight = true;
    }
  }

  keyUpHandler(event) {
    for (let snake of this.snakes) {
      if (event.key === snake.keyleft) snake.isTurningLeft = false;
      if (event.key === snake.keyright) snake.isTurningRight = false;
    }
  }

  internalToVisual() {
    this.ctx.drawImage(this.internalCanvas, 0, 0);
  }

  runRound() {
    for (let snake of this.snakes) {
      snake.run(this.snakes, this.canvas);
      snake.drawToInternal(this.ictx);
    }
    this.internalToVisual();
    for (let snake of this.snakes) {
      snake.drawToVisual(this.ctx);
    }
  }
}

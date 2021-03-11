import Snake from "./snake.mjs";

export default class Game {
  constructor(canvas, playersProps) {
    this.internalCanvas = document.createElement("canvas");
    this.internalCanvas.height = canvas.height;
    this.internalCanvas.width = canvas.width;
    this.canvas = canvas;
    this.ictx = this.internalCanvas.getContext("2d");
    this.ctx = canvas.getContext("2d");
    this.snakes = this.snakeInitialization(playersProps);
    this.previousTimeStamp = 0;
    this.roundReset();
  }

  snakeInitialization(
    playersProps = [
      {
        name: "Borus",
        leftkey: "ArrowLeft",
        rightkey: "ArrowDown",
        color: "#90be6d",
      },
      { name: "Janos", leftkey: "q", rightkey: "w", color: "#f94144" },
    ]
  ) {
    let snakes = [];
    for (let { name, leftkey, rightkey, color } of playersProps) {
      snakes.push(new Snake(leftkey, rightkey, color, name, this.canvas));
    }
    return snakes;
  }

  roundReset() {
    for (let snake of this.snakes) {
      snake.setSnake(this.canvas);
    }
    this.startCountDown = 3 * 60;
    this.endCountDown = 3 * 60;
    this.isRoundStarted = false;
    this.isRoundEnded = false;
    this.setBackground();
  }

  setBackground() {
    const backgroundColor = "#001427";
    this.ictx.fillStyle = backgroundColor;
    this.ictx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.internalToVisual();
  }

  internalToVisual() {
    this.ctx.drawImage(this.internalCanvas, 0, 0);
  }

  clickHandler() {
    this.roundReset();
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

  runRound() {
    if (!this.isRoundStarted) {
      this.startCountDown--;
      if (this.startCountDown < 0) this.isRoundStarted = true;
    }
    if (this.isRoundEnded) this.endCountDown--;
    if (this.endCountDown < 0) this.roundReset();

    for (let snake of this.snakes) {
      snake.run(
        this.snakes,
        this.canvas.width,
        this.canvas.height,
        this.isRoundStarted
      ); // Need to take live bonus array here
      snake.internalRender(this.ictx);
    }
    this.internalToVisual();
    for (let snake of this.snakes) {
      snake.render(this.ctx, this.isRoundStarted);
    }

    //bonus render
  }

  debug(ctx, timeStamp) {
    let fps = Math.round(1000 / (timeStamp - this.previousTimeStamp));
    this.previousTimeStamp = timeStamp;
    ctx.fillText(`FPS : ${fps}`, 10, 10);
  }

  runGame(timeStamp) {
    this.runRound();
    this.debug(this.ctx, timeStamp);
    window.requestAnimationFrame((timeStamp) => this.runGame(timeStamp));
  }
}

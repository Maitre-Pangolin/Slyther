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
    this.setBackground();
    this.internalToVisual();
  }

  setBackground() {
    const backgroundColor = "#001427";
    this.ictx.fillStyle = backgroundColor;
    this.ictx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

  clickHandler() {
    for (let snake of this.snakes) {
      snake.setSnake(this.canvas);
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

  runGame(timeStamp) {
    this.runRound();
    /*fps = Math.round(1000 / (timeStamp - prevTime));
    prevTime = timeStamp;
    ctx.fillText(`FPS : ${fps}`, 10, 10);*/
    window.requestAnimationFrame((timeStamp) => this.runGame(timeStamp));
  }
}

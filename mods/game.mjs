import Snake from "./snake.mjs";
import BonusHandler from "./bonus.mjs";

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
    this.bonusHandler = new BonusHandler(this.snakes);
    this.roundReset();
    this.isPaused = false;
  }

  snakeInitialization(
    playersProps = [
      {
        name: "Black Mamba",
        leftkey: "ArrowLeft",
        rightkey: "ArrowDown",
        color: "#90be6d",
      },
      { name: "Red Viper", leftkey: "q", rightkey: "w", color: "#f94144" },
      { name: "Rattle Snake", leftkey: "q", rightkey: "w", color: "#f3722c" },
    ]
  ) {
    let snakes = [];
    playersProps.forEach(({ name, leftkey, rightkey, color }) =>
      snakes.push(new Snake(leftkey, rightkey, color, name, this.canvas))
    );
    return snakes;
  }

  roundReset() {
    this.aliveSnake = this.snakes.length;
    this.snakes.forEach((snake) => snake.setSnake());
    this.startCountDown = 3 * 60;
    this.endCountDown = 3 * 60;
    this.isRoundStarted = false;
    this.isRoundEnded = false;
    this.setBackground();
    this.bonusHandler.resetBonusSystem();
  }

  //  ############### COMMAND ###################

  clickHandler() {
    this.isPaused = !this.isPaused;
  }

  keyDownHandler(event) {
    this.snakes.forEach((snake) => {
      if (event.key === snake.keyleft) snake.isTurningLeft = true;
      if (event.key === snake.keyright) snake.isTurningRight = true;
    });
  }

  keyUpHandler(event) {
    this.snakes.forEach((snake) => {
      if (event.key === snake.keyleft) snake.isTurningLeft = false;
      if (event.key === snake.keyright) snake.isTurningRight = false;
    });
  }

  // #################### GRAPHICS  ###################

  setBackground() {
    const backgroundColor = "#001427";
    this.ictx.fillStyle = backgroundColor;
    this.ictx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.internalToVisualCanvas();
  }

  internalToVisualCanvas() {
    this.ctx.drawImage(this.internalCanvas, 0, 0);
  }

  updateInternalCanvas() {
    if (this.isRoundStarted) {
      this.snakes.forEach((snake) => {
        if (snake.isTrailing && snake.isAlive) {
          this.ictx.beginPath();
          this.ictx.arc(snake.pos.x, snake.pos.y, snake.radius, 0, Math.PI * 2);
          this.ictx.fillStyle = snake.color;
          this.ictx.fill();
          this.ictx.closePath();
        }
      });
    }
    this.internalToVisualCanvas();
  }

  displaySnakes() {
    this.updateInternalCanvas();

    this.snakes.forEach((snake) => {
      if (!this.isRoundStarted) {
        snake.displayDirection(this.ctx);
      }
      snake.displayHead(this.ctx);
    });
  }

  // #################### PHYSICS #####################

  mover() {
    this.snakes.forEach((snake) => {
      snake.turn();
      if (this.isRoundStarted) {
        snake.updatePosition();
        if (snake.isAlive) {
          snake.addToBody();
          snake.checkHole();
        }
      }
    });
  }

  collider() {
    let deathCounter = 0;

    function circleIntersection(
      { x: x1, y: y1, radius: r1 },
      { x: x2, y: y2, radius: r2 }
    ) {
      return (x2 - x1) ** 2 + (y2 - y1) ** 2 < (r1 + r2) ** 2 ? true : false;
    }

    const wallCollide = (snake) => {
      if (
        snake.pos.x + snake.radius > this.canvas.width ||
        snake.pos.x - snake.radius < 0 ||
        snake.pos.y + snake.radius > this.canvas.height ||
        snake.pos.y - snake.radius < 0
      ) {
        snake.isAlive = false;
        this.aliveSnake--;
        deathCounter++;
      }
    };

    const updateScore = (value) => {
      this.snakes.forEach((snake) => snake.incrementScore(value));
    };

    this.snakes.forEach((snake) => {
      if (snake.isAlive) {
        //wallCollide(snake);
        let snakeDot = { ...snake.pos, radius: snake.radius };
        for (let otherSnake of this.snakes) {
          let dotToCollide =
            snake === otherSnake
              ? otherSnake.trail
              : otherSnake.trail.concat(otherSnake.head);

          for (let dot of dotToCollide) {
            if (circleIntersection(dot, snakeDot)) {
              snake.isAlive = false;
              this.aliveSnake--;
              deathCounter++;
              break;
            }
          }
          if (!snake.isAlive) break;
        }
      }
    });
    if (deathCounter) updateScore(deathCounter);
    this.bonusHandler.bonusCollisionHandler(circleIntersection);
  }

  // #################### RUNTIME #####################

  roundManager() {
    if (!this.isRoundStarted) {
      this.startCountDown--;
      if (this.startCountDown < 0) {
        this.isRoundStarted = true;
        this.bonusHandler.startBonusSystem();
      }
    }
    if (this.aliveSnake < 1) this.endCountDown--; // 1 for debug // two for normal
    if (this.endCountDown < 0) this.roundReset();
  }

  debug(ctx, timeStamp) {
    let fps = Math.round(1000 / (timeStamp - this.previousTimeStamp));
    this.previousTimeStamp = timeStamp;
    ctx.font = "20px serif";
    ctx.fillStyle = "red";
    ctx.fillText(`FPS : ${fps}`, 20, 20);
  }

  runGame(timeStamp) {
    if (!this.isPaused) {
      this.roundManager();
      this.mover();
      this.collider();
      this.bonusHandler.bonusManagement();
      this.displaySnakes();
      this.bonusHandler.bonusDisplay(this.ctx);
      //this.debug(this.ctx, timeStamp);
    }
    window.requestAnimationFrame((timeStamp) => this.runGame(timeStamp));
  }
}

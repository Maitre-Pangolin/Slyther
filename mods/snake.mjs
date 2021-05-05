export default class Snake {
  constructor(keyleft, keyright, color, name) {
    this.name = name;
    this.keyleft = keyleft;
    this.keyright = keyright;
    this.color = color;
    this.score = 0;
    this.setSnake();
    this.scoreDiv = document.createElement("div");
    this.scoreDiv.appendChild(document.createTextNode(this.name));
    document.getElementById("score").appendChild(this.scoreDiv);
    this.displayScore();
  }

  setSnake() {
    this.dot = {
      x: 100 + 700 * Math.random(), //NEED TO REMOVE HARD CODING GLOBAL VAR ?
      y: 100 + 700 * Math.random(),
      radius: 3,
    };
    this.velocity = 1.5;
    this.dir = Math.random() * Math.PI * 2;
    this.steerAngle = Math.PI / 40;
    this.isTurningLeft = false;
    this.isTurningRight = false;
    this.isAlive = true;
    this.holeDuration = 0.3 * 60;
    this.setRandomHole();
    this.isTrailing = true;
    this.trail = [];
    this.head = [];
    this.addToBody();
  }

  setRandomHole() {
    this.stepCount = 0;
    this.timeBetweenHole = 2 * 60 * (1 + 2 * Math.random());
  }

  addToBody() {
    if (this.isTrailing) {
      if (this.head.length > 20) this.trail.push(this.head.shift());
      this.head.push({ ...this.dot });
    }
  }

  checkHole() {
    this.stepCount++;
    if (this.isTrailing && this.stepCount > this.timeBetweenHole)
      this.isTrailing = false;
    if (
      !this.isTrailing &&
      this.stepCount > this.timeBetweenHole + this.holeDuration
    ) {
      this.isTrailing = true;
      this.setRandomHole();
    }
  }

  moveLeft() {
    this.dir -= this.steerAngle;
  }

  moveRight() {
    this.dir += this.steerAngle;
  }

  turn() {
    if (this.isTurningLeft) {
      this.moveLeft();
    }
    if (this.isTurningRight) {
      this.moveRight();
    }
  }

  updatePosition() {
    this.dot.x += Math.cos(this.dir) * this.velocity;
    this.dot.y += Math.sin(this.dir) * this.velocity;
  }

  incrementScore(value) {
    if (this.isAlive) {
      this.score += value;
      this.displayScore();
    }
  }

  //################ DISPLAY #################

  displayDirection(ctx) {
    ctx.strokeStyle = this.color;
    ctx.setLineDash([4, 8]);
    ctx.lineWidth = 3;
    ctx.beginPath();

    ctx.moveTo(this.dot.x, this.dot.y);
    let scale = 30;
    ctx.lineTo(
      this.dot.x + scale * Math.cos(this.dir),
      this.dot.y + scale * Math.sin(this.dir)
    );
    ctx.closePath();
    ctx.stroke();
  }

  displayHead(ctx) {
    ctx.beginPath();
    ctx.arc(this.dot.x, this.dot.y, this.dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.dot.x, this.dot.y, this.dot.radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }

  displayScore() {
    this.scoreDiv.textContent = `${this.name} : ${this.score}`;
    this.scoreDiv.style.color = this.color;
    this.scoreDiv.style.borderLeftColor = this.color;
  }
}

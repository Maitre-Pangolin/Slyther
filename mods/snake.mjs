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
    this.pos = {
      x: 100 + 700 * Math.random(), //NEED TO REMOVE HARD CODING GLOBAL VAR ?
      y: 100 + 700 * Math.random(),
    };
    this.radius = 3;
    this.velocity = 1.5;
    this.dir = Math.random() * Math.PI * 2;
    this.steerAngle = Math.PI / 40;
    this.isTurningLeft = false;
    this.isTurningRight = false;
    this.isAlive = true;
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
      this.head.push({ ...this.pos, radius: this.radius });
    }
  }

  checkHole() {
    this.stepCount++;
    if (this.isTrailing && this.stepCount > this.timeBetweenHole)
      this.isTrailing = false;
    if (!this.isTrailing && this.stepCount > this.timeBetweenHole + 0.3 * 60) {
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
    this.pos.x += Math.cos(this.dir) * this.velocity;
    this.pos.y += Math.sin(this.dir) * this.velocity;
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

    ctx.moveTo(this.pos.x, this.pos.y);
    let scale = 30;
    ctx.lineTo(
      this.pos.x + scale * Math.cos(this.dir),
      this.pos.y + scale * Math.sin(this.dir)
    );
    ctx.closePath();
    ctx.stroke();
  }

  displayHead(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius * 0.5, 0, Math.PI * 2);
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

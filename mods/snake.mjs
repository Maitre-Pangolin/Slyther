export default class Snake {
  constructor(keyleft, keyright, color, name, canvas) {
    this.name = name;
    this.keyleft = keyleft;
    this.keyright = keyright;
    this.color = color;
    this.setSnake(canvas);
  }

  setSnake(canvas) {
    this.x = (canvas.width / 4) * (1 + Math.random());
    this.y = (canvas.height / 4) * (1 + Math.random());
    this.radius = 3;
    this.velocity = 1.5;
    this.dir = 0;
    this.steerAngle = Math.PI / 40;
    this.isTurningLeft = false;
    this.isTurningRight = false;
    this.isAlive = true;
    this.randomHole();
    this.isTrailing = true;
    this.trail = [];
    this.addToTrail();
  }

  static circleIntersection(
    { x: x1, y: y1, radius: r1 },
    { x: x2, y: y2, radius: r2 }
  ) {
    return (x2 - x1) ** 2 + (y2 - y1) ** 2 < (r1 + r2) ** 2 ? true : false;
  }

  randomHole() {
    this.stepCount = 0;
    this.timeBetweenHole = 2 * 60 * (1 + 2 * Math.random());
  }

  internalRender(ictx) {
    // Remanant Snake Position
    if (this.isTrailing && this.isAlive) {
      ictx.beginPath();
      ictx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ictx.fillStyle = this.color;
      ictx.fill();
      ictx.closePath();
    }
  }

  addToTrail() {
    if (this.isTrailing)
      this.trail.push({ x: this.x, y: this.y, radius: this.radius });
  }

  drawHead(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  checkHole() {
    this.stepCount++;
    if (this.isTrailing && this.stepCount > this.timeBetweenHole)
      this.isTrailing = false;
    if (!this.isTrailing && this.stepCount > this.timeBetweenHole + 0.3 * 60) {
      this.isTrailing = true;
      this.randomHole();
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
    this.x += Math.cos(this.dir) * this.velocity;
    this.y += Math.sin(this.dir) * this.velocity;
  }

  wallCollide(X, Y) {
    if (
      this.x + this.radius > X ||
      this.x - this.radius < 0 ||
      this.y + this.radius > Y ||
      this.y - this.radius < 0
    )
      this.isAlive = false;
  }

  snakeCollide(snakes) {
    for (let snake of snakes) {
      let beheadedTrail =
        this === snake ? snake.trail.slice(0, -20) : snake.trail.slice(0, -1);
      for (let dot of beheadedTrail) {
        if (Snake.circleIntersection(dot, this.trail[this.trail.length - 1]))
          this.isAlive = false;
      }
    }
  }

  run(snakes, X, Y, isRoundStarted) {
    this.turn();
    if (isRoundStarted) {
      this.updatePosition();
      if (this.isAlive) {
        this.addToTrail();
        this.checkHole();
        this.wallCollide(X, Y);
        this.snakeCollide(snakes);
      }
    }
  }

  render(ctx, isRoundStarted) {
    this.drawHead(ctx);
    if (!isRoundStarted) this.displayDirection(ctx);
  }

  displayDirection(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.setLineDash([4, 5]);
    ctx.moveTo(this.x, this.y);
    let scale = 20;
    ctx.lineTo(
      this.x + scale * Math.cos(this.dir),
      this.y + scale * Math.sin(this.dir)
    );
    ctx.closePath();
    ctx.stroke();
  }
}

export default class Snake {
  constructor(keyleft, keyright, color, canvas) {
    this.keyleft = keyleft;
    this.keyright = keyright;
    this.color = color;
    this.x = (canvas.width / 4) * (1 + Math.random());
    this.y = (canvas.height / 4) * (1 + Math.random());
    this.radius = 3;
    this.velocity = 1.5;
    this.dir = 0;
    this.steerAngle = Math.PI / 40;
    this.isTurningLeft = false;
    this.isTurningRight = false;
    this.isAlive = true;
    this.stepCount = 0;
    this.stepToHole = 2 * 60 * (1 + 1 * Math.random());
    this.isTrailing = true;
    this.trail = [];
  }

  static circleIntersection(
    { x: x1, y: y1, radius: r1 },
    { x: x2, y: y2, radius: r2 }
  ) {
    return (x2 - x1) ** 2 + (y2 - y1) ** 2 < (r1 + r2) ** 2 ? true : false;
  }

  drawToInternal(ictx) {
    if (this.isTrailing) {
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

  drawToVisual(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  checkHole() {
    this.stepCount++;
    if (this.isTrailing && this.stepCount > this.stepToHole)
      this.isTrailing = false;
    if (!this.isTrailing && this.stepCount > this.stepToHole + 0.3 * 60) {
      this.isTrailing = true;
      this.stepCount = 0;
      this.stepToHole = 2 * 60 * (1 + 1 * Math.random());
    }
  }

  moveLeft() {
    this.dir -= this.steerAngle;
  }

  moveRight() {
    this.dir += this.steerAngle;
  }

  updatePosition() {
    if (this.isTurningLeft) {
      this.moveLeft();
    }
    if (this.isTurningRight) {
      this.moveRight();
    }
    this.x += Math.cos(this.dir) * this.velocity;
    this.y += Math.sin(this.dir) * this.velocity;
  }

  wallCollide(canvas) {
    if (
      this.x + this.radius > canvas.width ||
      this.x - this.radius < 0 ||
      this.y + this.radius > canvas.height ||
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

  reset(canvas) {
    this.x = (canvas.width / 4) * (1 + Math.random());
    this.y = (canvas.height / 4) * (1 + Math.random());
    this.dir = 0;
    this.isAlive = true;
    this.trail = [];
  }

  run(snakes, canvas) {
    if (this.isAlive) {
      this.updatePosition();
      this.addToTrail();
      this.wallCollide(canvas);
      this.checkHole();
      this.snakeCollide(snakes);
    }
  }
}

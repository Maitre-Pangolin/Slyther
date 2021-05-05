//Bonus List Idea

//Global Bonus
// Open walls  /  Eraser  / Shrinking Walls //

//Self Apply Bonus

//Speed Up , Speed Down , Radius x2 , Radius /2

//2B97DA blue

let bonusSprite = document.createElement("img");
bonusSprite.src = "../ressources/Bonus.png";
const sizeSprite = 50;

export default class BonusHandler {
  constructor(snakes) {
    this.liveBonus = [];
    this.isStarted = false;
    this.snakes = snakes;
  }

  startBonusSystem() {
    this.isStarted = true;
    this.setBonusGenerationTimer();
  }

  resetBonusSystem() {
    this.liveBonus = [];
    this.isStarted = false;
  }

  bonusCollisionHandler(intersectionCalculator) {
    const aliveSnakes = this.snakes.filter((snake) => snake.isAlive);
    const nonActivatedBonus = this.liveBonus.filter(
      (bonus) => !bonus.isActivated
    );

    aliveSnakes.forEach((snake) => {
      let snakeDot = { ...snake.pos, radius: snake.radius };
      nonActivatedBonus.forEach((bonus) => {
        if (intersectionCalculator(snakeDot, bonus.dot)) {
          bonus.bonusCollided();
          if (bonus instanceof SelfBonus) bonus.linkBonus(snake);
          if (bonus instanceof Malus) {
            aliveSnakes
              .filter((s) => s != snake)
              .forEach((s) => {
                if (!bonus.affectedSnakes.includes(s))
                  bonus.affectedSnakes.push(s);
              });
          }
        }
      });
    });
  }

  setBonusGenerationTimer() {
    this.bonusGenerationTimer = 60 * (0.5 + 4 * Math.random());
  }

  bonusDisplay(ctx) {
    this.liveBonus.forEach((bonus) => {
      if (!bonus.isActivated) bonus.displayBonus(ctx);
    });
  }

  bonusGenerationTimerUpdate() {
    this.bonusGenerationTimer--;
    if (this.bonusGenerationTimer <= 0) {
      this.liveBonus.push(bonusFactory());
      this.setBonusGenerationTimer();
    }
  }

  bonusDeletionCheck() {
    this.liveBonus.forEach((bonus) => {
      if (bonus.timer <= 0 && bonus.isActivated) bonus.effectDeactivation();
    });
    this.liveBonus = this.liveBonus.filter((bonus) => bonus.timer > 0);
  }

  bonusActivationCheck() {
    this.liveBonus.forEach((bonus) => {
      bonus.timer--;
      if (!bonus.isActivated && bonus.wasCollided) bonus.bonusActivation();
    });
  }

  bonusManagement() {
    if (this.isStarted) {
      this.bonusGenerationTimerUpdate();
      this.bonusActivationCheck();
      this.bonusDeletionCheck();
    }
  }
}

////////////////  BONUS FACTORY //////////////////

function bonusFactory() {
  //Random bonus creation
  function randInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  let picked = randInt(2);
  if (picked === 1) {
    picked = randInt(2);
    if (picked === 1) return new SizeUpSelfBonus();
    if (picked === 2) return new SpeedUpSelfBonus();
  }
  if (picked === 2) {
    picked = randInt(2);
    if (picked === 1) return new SizeUpMalus();
    if (picked === 2) return new SpeedUpMalus();
  }
  return;
}

////////////////  BONUS //////////////////

class Bonus {
  constructor(spriteX = 0, spriteY = 0) {
    this.pos = {
      x: 100 + 700 * Math.random(), //NEED TO REMOVE HARD CODING GLOBAL VAR ?
      y: 100 + 700 * Math.random(),
    };
    this.radius = 20;
    this.dot = { ...this.pos, radius: this.radius };
    this.timer = 6 * 60;
    this.bonusDuration = 10 * 60;
    this.wasCollided = false;
    this.isActivated = false;
    this.spriteX = spriteX;
    this.spriteY = spriteY;
    this.affectedSnakes = [];
    this.previousProperties = [];
  }

  linkBonus(snake) {
    this.affectedSnakes.push(snake);
  }

  bonusCollided() {
    this.wasCollided = true;
  }

  bonusActivation() {
    this.isActivated = true;
    this.timer = this.bonusDuration;
    this.effectActivation();
  }

  effectActivation() {
    this.affectedSnakes.forEach((snake) => {
      this.effect(snake);
    });
  }

  effectDeactivation() {
    this.affectedSnakes.forEach((snake) => {
      this.reverseEffect(snake);
    });
  }

  effect(snake) {
    this.previousProperties.push(snake.color);
    snake.color = "#ffd166";
  }

  reverseEffect(snake) {
    snake.color = this.previousProperties.shift();
  }

  displayBonus(ctx) {
    ctx.drawImage(
      bonusSprite,
      this.spriteX * sizeSprite,
      this.spriteY * sizeSprite,
      sizeSprite,
      sizeSprite,
      this.pos.x - sizeSprite / 2,
      this.pos.y - sizeSprite / 2,
      sizeSprite,
      sizeSprite
    );
  }
}

class GlobalBonus extends Bonus {}

class SelfBonus extends Bonus {
  constructor(spriteX, spriteY) {
    super(spriteX, spriteY);
  }
}

class Malus extends Bonus {
  constructor(spriteX, spriteY) {
    super(spriteX, spriteY);
  }
}

class SizeUpSelfBonus extends SelfBonus {
  constructor() {
    super(0, 3);
  }
  effect = sizeUp;
  reverseEffect = sizeDown;
}

class SpeedUpSelfBonus extends SelfBonus {
  constructor() {
    super(1, 3);
  }

  effect = speedUp;
  reverseEffect = speedDown;
}

class SizeUpMalus extends Malus {
  constructor() {
    super(0, 2);
  }
  effect = sizeUp;
  reverseEffect = sizeDown;
}

class SpeedUpMalus extends Malus {
  constructor() {
    super(1, 2);
  }
  effect = speedUp;
  reverseEffect = speedDown;
}

// LIST OF EFFECTS

const sizeCoeff = 2;
const sizeHoleCoeff = 1.5;

function sizeUp(snake) {
  snake.radius *= sizeCoeff;
  snake.holeDuration *= sizeHoleCoeff;
}

function sizeDown(snake) {
  snake.radius /= sizeCoeff;
  snake.holeDuration /= sizeHoleCoeff;
}

const speedCoeff = 2;
const speedHoleCoeff = 1.5;

function speedUp(snake) {
  snake.velocity *= speedCoeff;
  snake.holeDuration *= speedHoleCoeff;
}

function speedDown(snake) {
  snake.velocity /= speedCoeff;
  snake.holeDuration /= speedHoleCoeff;
}

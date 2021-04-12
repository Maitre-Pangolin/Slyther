//Bonus List Idea

//Global Bonus
// Open walls  /  Eraser  / Shrinking Walls //

//Self Apply Bonus

//Speed Up , Speed Down , Radius x2 , Radius /2

//2B97DA blue

let bonusSprite = document.createElement("img");
bonusSprite.src = "../ressources/Bonus.png";
const sizeSprite = 50;

export default class BonusManager {
  constructor() {
    this.liveBonus = [];
    this.isStarted = false;
  }

  startBonusSystem() {
    this.isStarted = true;
    this.setBonusGenerationTimer();
  }

  resetBonus() {
    //revert all bonus effect and reset array
    this.liveBonus.forEach((bonus) => {
      bonus.effectDeactivation();
    });
    this.liveBonus = [];
    this.isStarted = false;
  }

  collisionManager(bonus, snake, snakes) {
    if (bonus instanceof SelfBonus) bonus.bonusCollided(snake);
    if (bonus instanceof Malus)
      snakes.forEach((otherSnake) => {
        if (otherSnake != snake) bonus.bonusCollided(otherSnake);
        bonus.affectedSnakes = bonus.affectedSnakes.filter((e) => e != snake);
      });

    //if (bonus instanceof Bonus) console.log("I m a reg Bonus");
  }

  setBonusGenerationTimer() {
    this.bonusGenerationTimer = 60 * (0.5 + 4 * Math.random());
  }

  bonusDisplay(ctx) {
    this.liveBonus.forEach((bonus) => {
      if (!bonus.isActivated) bonus.displayBonus(ctx);
    });
  }

  bonusTimerUpdate() {
    this.bonusGenerationTimer--;
    if (this.bonusGenerationTimer <= 0) {
      this.liveBonus.push(bonusFactory());
      this.setBonusGenerationTimer();
    }
  }

  bonusCleaning() {
    this.liveBonus = this.liveBonus.filter((bonus) => bonus.timer > 0);
  }

  bonusActivationStatus() {
    this.liveBonus.forEach((bonus) => {
      bonus.timer--;
      if (!bonus.isActivated && bonus.affectedSnakes.length > 0)
        bonus.bonusActivation();
      if (bonus.timer <= 0 && bonus.isActivated) bonus.bonusDeletion();
    });
  }

  bonusManagement() {
    if (this.isStarted) {
      this.bonusTimerUpdate();
      this.bonusActivationStatus();
      this.bonusCleaning();
    }
  }
}

function bonusFactory() {
  //Random bonus creation
  let picked = Math.floor(Math.random() * 2);
  let bonus = null;
  //if (picked === 0) bonus = new Bonus();
  if (picked === 0) bonus = new Malus();
  if (picked === 1) bonus = new SelfBonus();
  return bonus;
}

//BONUS

class Bonus {
  constructor() {
    this.pos = {
      x: 100 + 700 * Math.random(), //NEED TO REMOVE HARD CODING GLOBAL VAR ?
      y: 100 + 700 * Math.random(),
    };
    this.radius = 20;
    this.dot = { ...this.pos, radius: this.radius };
    this.timer = 6 * 60;
    this.bonusDuration = 10 * 60;
    this.isActivated = false;
    this.spriteX = 0;
    this.spriteY = 0;
    this.affectedSnakes = [];
    this.previousProperties = [];
  }

  bonusCollided(snake) {
    this.affectedSnakes.push(snake);
  }

  bonusActivation() {
    this.isActivated = true;
    this.timer = this.bonusDuration;
    this.affectedSnakes.forEach(() => this.effectActivation());
  }

  bonusDeletion() {
    this.affectedSnakes.forEach(() => this.effectDeactivation());
  }

  effectActivation() {
    this.affectedSnakes.forEach((snake) => this.effect(snake));
  }

  effect(snake) {
    this.previousProperties.push(snake.color);
    snake.color = "#ffd166";
  }

  reverseEffect(snake) {
    snake.color = this.previousProperties.shift();
  }

  effectDeactivation() {
    this.affectedSnakes.forEach((snake) => this.reverseEffect(snake));
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
  constructor() {
    super();
    this.spriteX = 0;
    this.spriteY = 3;
  }

  effect(snake) {
    snake.radius *= 2;
  }

  reverseEffect(snake) {
    snake.radius /= 2;
  }
}

class Malus extends Bonus {
  constructor() {
    super();
    this.spriteX = 0;
    this.spriteY = 2;
  }

  effect(snake) {
    snake.radius *= 2;
  }

  reverseEffect(snake) {
    snake.radius /= 2;
  }
}

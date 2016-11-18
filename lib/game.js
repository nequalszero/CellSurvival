const PlayerCell = require("./player_cell");
const Cell = require("./cell");
const Util = require("./util");

class Game {
  constructor() {
    this.playerCells = [];
    this.cells = [];
    this.screenCenter = this.centerPosition();
    this.inProgress = false;
  }

  add(object) {
    if (object instanceof PlayerCell) {
      this.playerCells.push(object);
    } else if (object instanceof Cell) {
      this.cells.push(object);
    } else {
      throw "game.js - object not accounted for";
    }
  }

  addCells() {
    let validPositionCount = 0;
    let newCell;
    for (let i = 0; i < Game.NUM_CELLS; i++) {
      newCell = new Cell({ game: this});
      if (this.isValidSpawnPos(newCell.pos, newCell.radius)) {
        validPositionCount += 1;
      }
      this.add(newCell);
    }
  }

  addPlayerCell() {
    const playerCell = new PlayerCell({
      game: this
    });

    this.add(playerCell);
    return playerCell;
  }

  allObjects() {
    return [].concat(this.playerCells, this.cells);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);

    this.allObjects().forEach(object => {
      object.draw(ctx);
    });

  }

  moveObjects(timeStep) {
    this.allObjects().forEach(object => {
      object.move(timeStep);
    });
  }

  checkCollisions() {
    this.allObjects().forEach((object1) => {
      this.allObjects().forEach((object2) => {
        if (object1.isCollidedWith(object2) && object1 !== object2) {
          object1.collideWith(object2);
        }
      });
    });
  }

  removeObject(object) {
    if (object instanceof PlayerCell) {
      this.playerCells.splice(this.playerCells.indexOf(object), 1);
    } else if (object instanceof Cell) {
      // if (object.radius !== 0) console.log("removing object of radius", object.radius);
      this.cells.splice(this.cells.indexOf(object), 1);
    }
  }

  step(timeStep) {
    this.adjustPlayerVelocity();
    this.moveObjects(timeStep);
    this.checkCollisions();
    this.checkGameStatus();
    // if (Math.floor(this.checkSystemMass()) !== Math.floor(this.totalMass)) {
    //   console.log("New system mass: ", this.checkSystemMass());
    // }
  }

  centerPosition() {
    return [Game.WIDTH/2, Game.HEIGHT/2];
  }

  randomPosition(radius) {
    let potentialPos;
    let invalid = true;

    while (invalid) {
      potentialPos = [
        Math.floor((Math.random() * Game.WIDTH) + 1),
        Math.floor((Math.random() * Game.HEIGHT) + 1)
      ];

      if (this.isValidSpawnPos(potentialPos, radius)) {
        invalid = false;
        break;
      }
    }

    return potentialPos;
  }

  isValidSpawnPos(pos, radius) {
    let xLeft = pos[0] - radius;
    let xRight = pos[0] + radius;
    let yTop = pos[1] - radius;
    let yBottom = pos[1] + radius;

    if (xLeft < 0 || xRight > Game.WIDTH) {
      return false;
    } else if (yTop < 0 || yBottom > Game.HEIGHT) {
      return false;
    } else if (!this.farEnoughFromCenter(pos, radius)) {
      return false;
    } else {
      return true;
    }
  }

  farEnoughFromCenter(pos, radius) {
    if (Util.dist(pos, this.screenCenter) < 100 + radius) {
      return false;
    } else {
      return true;
    }
  }

  redirectIfOutOfBounds(pos, vel, radius) {
    let xLeft = pos[0] - radius;
    let xRight = pos[0] + radius;
    let yTop = pos[1] - radius;
    let yBottom = pos[1] + radius;

    if (xLeft < 0 && vel[0] < 0) {
      return [-1*vel[0], vel[1]];
    } else if (xRight > Game.WIDTH && vel[0] > 0) {
      return [-1*vel[0], vel[1]];
    } else if (yTop < 0 && vel[1] < 0) {
      return [vel[0], -1*vel[1]];
    } else if (yBottom > Game.HEIGHT && vel[1] > 0) {
      return [vel[0], -1*vel[1]];
    } else {
      return vel;
    }
  }

  gameOver() {
    if (this.allObjects().length === 1 && this.playerCells.length === 1) {
      this.inProgress = false;
      return "win";
    } else if (this.playerCells.length === 0) {
      this.inProgress = false;
      return "loss";
    } else {
      return "incomplete";
    }
  }

  checkGameStatus() {
    const canvasEl = document.getElementsByTagName("canvas")[0];
    const gameOverEl = document.getElementById("game-over-container");
    const gameOverTitle = document.getElementsByClassName("game-over title")[0];
    const gameOverDesc1 = document.getElementsByClassName("game-over desc line1")[0];

    if (this.gameOver() !== "incomplete") {
      canvasEl.classList.add("opaque");
      gameOverEl.classList.remove("hidden");
      gameOverEl.classList.add("visible");
      if (this.gameOver() === "win") {
        gameOverTitle.innerHTML = "Dominant Lifeform";
        gameOverDesc1.innerHTML = "You own this ecosystem";
      } else {
        gameOverTitle.innerHTML = "Absorbed";
        gameOverDesc1.innerHTML = "Better luck next time";
      }
    }
  }

  adjustPlayerVelocity() {
    if (this.playerCells.length !== 0) {
      let player = this.playerCells[0];
      player.vel = [(1-Game.PLAYER_FRICTION)*player.vel[0],
                    (1-Game.PLAYER_FRICTION)*player.vel[1] ];
    }
  }

  checkSystemMass() {
    let total = 0;
    this.allObjects().forEach(object => {
      total += Math.PI * Math.pow(object.radius, 2);
    });
    return total;
  }

}

Game.BG_COLOR = "#001f3f";
Game.WIDTH = window.innerWidth;
Game.HEIGHT = window.innerHeight;
Game.NUM_CELLS = 400;
Game.PLAYER_FRICTION = 0.005;

module.exports = Game;

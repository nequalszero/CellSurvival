const PlayerCell = require("./player_cell");
const Cell = require("./cell");
const Util = require("./util");

class Game {
  constructor() {
    this.playerCells = [];
    this.cells = [];
    this.screenCenter = this.centerPosition();

    this.addCells();
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
    for (let i = 0; i < Game.NUM_CELLS; i++) {
      this.add(new Cell({ game: this}));
    }
  }

  addPlayerCell() {
    const playerCell = new PlayerCell({
      game: this
    });

    this.add(playerCell);
    return playerCell;
  }

  // addCell() {
  //   let cell = new Cell({
  //     game: this
  //   });
  //
  //   this.add(cell);
  //   return cell;
  // }

  allObjects() {
    return [].concat(this.playerCells, this.cells);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);

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
      this.cells.splice(this.cells.indexOf(object), 1);
    }
  }

  step(timeStep) {
    this.moveObjects(timeStep);
    this.checkCollisions();
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

}

Game.BG_COLOR = "#001f3f";
Game.WIDTH = window.innerWidth;
Game.HEIGHT = window.innerHeight;
Game.NUM_CELLS = 400;

module.exports = Game;

const MovingObject = require("./moving_object");
const Util = require("./util");

class PlayerCell extends MovingObject {
  constructor(options) {
    options.radius = PlayerCell.START_RADIUS;
    options.vel = options.vel || [0, 0];
    options.pos = options.game.centerPosition();
    options.color = PlayerCell.CELL_COLOR;
    super(options);
  }

  accelerate(magnitudes) {
    this.vel[0] += magnitudes[0];
    this.vel[1] += magnitudes[1];
  }
}


PlayerCell.CELL_COLOR = "#111111";
PlayerCell.START_RADIUS = 8;
module.exports = PlayerCell;

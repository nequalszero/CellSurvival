const MovingObject = require("./moving_object");
const Util = require("./util");

class Cell extends MovingObject {
  constructor(options) {
    options.radius = Cell.randomRadius();
    options.vel = options.vel || [0, 0];
    options.pos = options.game.randomPosition(options.radius);
    options.color = Cell.CELL_COLOR;
    super(options);
  }


}

Cell.randomRadius = () => {
  let prob = Math.floor((Math.random() * 200) + 1);
  if (Cell.RADIUS_DISTRIBUTION[prob]) {
    return Cell.RADIUS_DISTRIBUTION[prob];
  } else {
    let radius;

    for (let i = 0; i < Cell.PERCENTAGE_KEYS.length; i++) {
      if (prob < Cell.PERCENTAGE_KEYS[i]) {
        radius = Cell.RADIUS_DISTRIBUTION[Cell.PERCENTAGE_KEYS[i]];
        break;
      }
    }
    return radius;
  }
};

Cell.RADIUS_DISTRIBUTION = {
  115: 1,
  135: 2,
  155: 3,
  170: 4,
  180: 6,
  193: 10,
  194: 12,
  195: 15,
  196: 20,
  197: 30,
  198: 40,
  199: 50,
  200: 60
};

Cell.PERCENTAGE_KEYS = Object.keys(Cell.RADIUS_DISTRIBUTION).map(el => parseInt(el));

Cell.CELL_COLOR = "#FFF";
module.exports = Cell;

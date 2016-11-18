const MovingObject = require("./moving_object");
const Util = require("./util");

class Cell extends MovingObject {
  constructor(options) {
    options.radius = Cell.randomRadius();
    options.vel = options.vel || Cell.randomVelocity();
    // options.vel = options.vel || [0, 0];
    options.pos = options.game.randomPosition(options.radius);
    options.color = Cell.randomColor();
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

Cell.randomVelocity = () => {
  const modifiers = [1, -1];

  return [
    modifiers[Math.floor(Math.random()*2)] * Math.random()/3,
    modifiers[Math.floor(Math.random()*2)] * Math.random()/3
  ];
};

Cell.randomColor = () => {
  let randomIdx = Math.floor((Math.random() * Cell.COLORS.length));
  if (randomIdx === 11) console.log("11");
  return Cell.COLORS[randomIdx];
};

Cell.RADIUS_DISTRIBUTION = {
  115: 1,
  135: 2,
  155: 3,
  170: 4,
  180: 5,
  193: 6,
  194: 10,
  195: 12,
  196: 15,
  197: 20,
  198: 30,
  199: 40,
  200: 50
};

Cell.PERCENTAGE_KEYS = Object.keys(Cell.RADIUS_DISTRIBUTION).map(el => parseInt(el));
Cell.COLORS = [
               "#9b59b6", "#c0392b", "#d35400", "#f1c40f", "#e67e22", "#2980b9",
               "#ecf0f1", "#3498db", "#1abc9c", "#2ecc71", "#ec1559", "#faf93C"
              ];
Cell.CELL_COLOR = "#FFF";
module.exports = Cell;

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", function() {
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.WIDTH;
	  canvasEl.height = Game.HEIGHT;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const PlayerCell = __webpack_require__(2);
	const Cell = __webpack_require__(6);
	const Util = __webpack_require__(4);
	
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
	          console.log("collision");
	        }
	      });
	    });
	  }
	
	  removeObject(object) {
	    if (object instanceof PlayerCell) {
	      this.playerCells.splice(this.playerCells.indexof(object), 1);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Util = __webpack_require__(4);
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	 const Util = __webpack_require__(4);
	
	class MovingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.color = options.color;
	    this.game = options.game;
	  }
	
	  collideWith(otherObject) {
	    // default do nothing
	  }
	
	  draw(ctx) {
	    ctx.fillStyle = this.color;
	
	    // starts a new path
	    ctx.beginPath();
	    // ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	    ctx.arc(
	      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	    );
	    ctx.fill();
	  }
	
	  isCollidedWith(otherObject) {
	    const centerDist = Util.dist(this.pos, otherObject.pos);
	    return centerDist < (this.radius + otherObject.radius);
	  }
	
	  move(timeDelta) {
	    //timeDelta is number of milliseconds since last move
	    //if the computer is busy the time delta will be larger
	    //in this case the MovingObject should move farther in this frame
	    //the velocity of object is how far it should move in 1/60th of a second
	    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
	    const offsetX = this.vel[0] * velocityScale;
	    const offsetY = this.vel[1] * velocityScale;
	
	    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	    this.vel = this.game.redirectIfOutOfBounds(this.pos, this.vel, this.radius);
	
	  }
	
	  remove() {
	    this.game.remove(this);
	  }
	}
	
	const NORMAL_FRAME_TIME_DELTA = 1000/60;
	
	module.exports = MovingObject;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	  dist(pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	    this.playerCell = this.game.addPlayerCell();
	  }
	
	  bindKeyHandlers() {
	    const playerCell = this.playerCell;
	
	    Object.keys(GameView.MOVES).forEach(k => {
	      let move = GameView.MOVES[k];
	
	      // global key provided by keymaster.js, takes a key and a function
	      key(k, () => { playerCell.accelerate(move); });
	    });
	  }
	
	  start() {
	    this.bindKeyHandlers();
	    this.lastTime = 0;
	
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate(time) {
	    const timeStep = time - this.lastTime;
	
	    this.game.step(timeStep);
	    this.game.draw(this.ctx);
	    this.lastTime = time;
	
	    requestAnimationFrame(this.animate.bind(this));
	  }
	}
	
	GameView.MOVES = {
	  "w": [ 0, -0.2 ],
	  "a": [ -0.2, 0 ],
	  "s": [ 0, 0.2 ],
	  "d": [ 0.2, 0 ],
	  "up": [ 0, -0.2 ],
	  "left": [ -0.2, 0 ],
	  "down": [ 0, 0.2 ],
	  "right": [ 0.2, 0 ]
	};
	
	module.exports = GameView;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Util = __webpack_require__(4);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
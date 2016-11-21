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
	const GameView = __webpack_require__(6);
	
	document.addEventListener("DOMContentLoaded", function() {
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  const buttonEl = document.getElementsByTagName("button")[0];
	  const entryEl = document.getElementById("entry-screen");
	  const gameOverEl = document.getElementById("game-over-container");
	  const directionsDD = document.getElementById("directions-dropdown");
	
	  canvasEl.width = Game.WIDTH;
	  canvasEl.height = Game.HEIGHT;
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	
	  const hideEntryEl = () => {
	    if (entryEl.classList.contains("visible")) {
	      entryEl.classList.remove("visible");
	      entryEl.classList.add("hidden");
	    }
	  };
	
	  const hideGameOverEl = () => {
	    if (gameOverEl.classList.contains("visible")) {
	      gameOverEl.classList.remove("visible");
	      gameOverEl.classList.add("hidden");
	    }
	  };
	
	  document.addEventListener("keypress", function(e) {
	    if (e.keyCode === 32 && game.inProgress === false) {
	      new GameView(game, ctx).start();
	      hideEntryEl();
	      hideGameOverEl();
	      canvasEl.classList.remove("opaque");
	    }
	  });
	
	  buttonEl.addEventListener("mouseover", function() {
	    directionsDD.classList.remove("hidden");
	    directionsDD.classList.add("visible");
	  });
	
	  buttonEl.addEventListener("mouseleave", function() {
	    directionsDD.classList.remove("visible");
	    directionsDD.classList.add("hidden");
	  });
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const PlayerCell = __webpack_require__(2);
	const Cell = __webpack_require__(5);
	const Util = __webpack_require__(4);
	
	class Game {
	  constructor() {
	    this.playerCells = [];
	    this.cells = [];
	    this.screenCenter = this.centerPosition();
	    this.inProgress = false;
	    this.paused = false;
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
	    let newCell;
	    for (let i = 0; i < Game.NUM_CELLS; i++) {
	      newCell = new Cell({ game: this});
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
	          if (object1 instanceof PlayerCell &&
	              object1.radius > object2.radius &&
	              object2.radius > 4) {
	            object1.color = object2.color;
	          }
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
	Game.PLAYER_FRICTION = 0.001;
	
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
	    options.color = "#ffffff";
	    // options.color = PlayerCell.CELL_COLOR;
	    super(options);
	    this.maxGlowRadius = this.setMaxGlowRadius(options.radius);
	    this.minGlowRadius = 1;
	    this.glowRadius = 1;
	    this.glowDirection = 1;
	    this.glowMod = 10;
	  }
	
	  accelerate(magnitudes) {
	    this.vel[0] += magnitudes[0];
	    this.vel[1] += magnitudes[1];
	  }
	
	  setMaxGlowRadius(startRadius) {
	    return startRadius >= 1 ? startRadius/2 : 1;
	  }
	
	  draw(ctx) {
	    // var grd = ctx.createRadialGradient(250, 250, 5, 250, 250, 140);
	    // grd.addColorStop(0, "white");
	    // grd.addColorStop(1, "green");
	    // ctx.arc(250, 250, 140, 0, 2 * Math.PI);
	    // ctx.fillStyle = grd;
	    // ctx.fill();
	    //
	    this.adjustGlowRadiusParams();
	    this.adjustGlowRadius();
	
	
	    let grd = ctx.createRadialGradient(
	                                         this.pos[0], this.pos[1],
	                                         this.glowRadius,
	                                         this.pos[0], this.pos[1],
	                                         this.radius
	                                      );
	
	    grd.addColorStop(0, "#ffffff"); // hex white
	    grd.addColorStop(1, this.color);
	
	    ctx.beginPath();
	    // starts a new path
	    // ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	    ctx.arc(
	      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	    );
	    ctx.fillStyle = grd;
	    ctx.fill();
	  }
	
	  adjustGlowRadiusParams() {
	    this.minGlowRadius = 1;
	    if (this.radius >= 50) {
	      this.glowMod = 2;
	      this.maxGlowRadius = this.radius/2;
	    } else if (this.radius >= 25) {
	      this.glowMod = this.radius * 10/25;
	      this.maxGlowRadius = this.radius/3;
	    } else if (this.radius < 25 && this.radius > 5) {
	      this.maxGlowRadius = this.radius/3;
	    } else {
	      this.maxGlowRadius = 1;
	      this.glowMod = 10;
	    }
	  }
	
	  adjustGlowRadius() {
	    if (this.glowRadius >= this.maxGlowRadius) {
	      this.glowDirection = -1;
	    } else if (this.glowRadius <= this.minGlowRadius) {
	      this.glowDirection = 1;
	    }
	    this.glowDirection = parseFloat(this.glowDirection);
	    this.glowMod = parseFloat(this.glowMod);
	    this.glowRadius = parseFloat(this.glowRadius);
	
	    // yields undefined for some reason if done without local radIncrease variable
	    let radIncrease = this.glowDirection/this.glowMod;
	    this.glowRadius += radIncrease;
	  }
	}
	
	
	PlayerCell.CELL_COLOR = "#111111";
	PlayerCell.START_RADIUS = 10;
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
	    if (this.radius === 0 || otherObject.radius === 0) {
	      return;
	    }
	    let thisLoss = this.potentialLoss();
	    let otherLoss = otherObject.potentialLoss();
	    let thisIncrease = this.potentialRadiusGain(otherLoss.area);
	    let otherIncrease = otherObject.potentialRadiusGain(thisLoss.area);
	
	    if (this.radius === otherObject.radius) {
	      return;
	    } else if (this.radius > otherObject.radius) {
	      this.color = this.adjustColor(thisIncrease, otherObject.color);
	      this.radius += thisIncrease;
	      otherObject.radius -= otherLoss.radius;
	      if (otherObject.radius === 0) otherObject.remove();
	    } else {
	      this.radius -= thisLoss.radius;
	      otherObject.color = otherObject.adjustColor(otherIncrease, this.color);
	      otherObject.radius += otherIncrease;
	      if (this.radius === 0) this.remove();
	    }
	  }
	
	  potentialLoss() {
	    let losses = {};
	    if (this.radius >= 1) {
	      losses.radius = 1;
	    } else {
	      losses.radius = this.radius;
	    }
	    losses.area = Math.PI * (2*this.radius - 1);
	    return losses;
	  }
	
	  potentialRadiusGain(areaGained) {
	    let currentArea = Math.PI * Math.pow(this.radius, 2);
	    return Math.pow(((currentArea + areaGained)/Math.PI), 0.5) - this.radius;
	  }
	
	  adjustColor(weight, color) {
	    if (weight < 0) return this.color;
	    weight = weight*1000; //Give color absorption more effect
	    let foreignColorObj = this.hexToRgb(color);
	    let currentColorObj = this.hexToRgb(this.color);
	    let currentWeight = Math.PI * Math.pow(this.radius, 2);
	
	    let newRed = Math.floor((currentWeight*currentColorObj.r + weight*foreignColorObj.r)/
	                 (currentWeight + weight));
	    let newGreen = Math.floor((currentWeight*currentColorObj.g + weight*foreignColorObj.g)/
	                   (currentWeight + weight));
	    let newBlue = Math.floor((currentWeight*currentColorObj.b + weight*foreignColorObj.b)/
	                  (currentWeight + weight));
	
	    return rgbToHex(newRed, newGreen, newBlue);
	  }
	
	  outOfRange(color) {
	    if (color < 0 || color > 255) return true;
	    return false;
	  }
	
	  hexToRgb(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });
	
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
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
	    this.game.removeObject(this);
	  }
	}
	
	const NORMAL_FRAME_TIME_DELTA = 1000/60;
	const componentToHex = (c) => {
	    var hex = c.toString(16);
	    return hex.length === 1 ? "0" + hex : hex;
	};
	
	const rgbToHex = (r, g, b) => {
	    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	};
	
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
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Util = __webpack_require__(4);
	
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
	               "#00ff00", "#3498db", "#1abc9c", "#2ecc71", "#ec1559", "#faf93C"
	              ];
	Cell.CELL_COLOR = "#FFF";
	module.exports = Cell;


/***/ },
/* 6 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	    this.resetGame();
	  }
	
	  resetGame() {
	    this.game.cells = [];
	    this.game.playerCells = [];
	    this.playerCell = this.game.addPlayerCell();
	    this.game.addCells();
	    this.game.totalMass = this.game.checkSystemMass();
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
	    this.game.inProgress = true;
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate(time) {
	    let timeStep = time - this.lastTime;
	    if (timeStep > 20) timeStep = 20;
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
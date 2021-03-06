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

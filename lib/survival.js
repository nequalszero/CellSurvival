const Game = require("./game");
const GameView = require("./game_view");

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

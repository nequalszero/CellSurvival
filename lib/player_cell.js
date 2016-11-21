const MovingObject = require("./moving_object");
const Util = require("./util");

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

 const Util = require("./util");

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

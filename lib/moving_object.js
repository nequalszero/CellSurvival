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

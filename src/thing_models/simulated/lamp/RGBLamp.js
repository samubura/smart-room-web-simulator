const ThingInterface = require("../../ThingInterface");

class Lamp extends ThingInterface {

  state;
  color;

  constructor() {
    super()
    this.color = '#ffffcc';
    this.state = false;
  }

  getState() {
    return this.state
  }

  getColor() {
    return this.color
  }

  toggle() {
    this.state = !this.state;
  }

  setColor(color) {
    this.color = color;
  }
}

module.exports = Lamp
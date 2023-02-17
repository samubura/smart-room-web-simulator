const ThingInterface = require("../../ThingInterface");

class GridEnvironment extends ThingInterface{

  boundaries = {
    xMax: undefined,
    xMin: undefined,
    yMax: undefined,
    yMin: undefined,
  }

  constructor(boundaries) {
    super()
    this.boundaries = boundaries
  }

  getBoundaries() {
    return this.boundaries
  }
}

module.exports = GridEnvironment;
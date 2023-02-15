const ThingInterface = require("./ThingInterface");

class SituatedThing extends ThingInterface {

  environment = undefined

  constructor(environment) {
    super()
    this.environment = environment
  }

}

module.exports = SituatedThing
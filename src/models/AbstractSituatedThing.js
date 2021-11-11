const ThingInterface = require("./ThingInterface");

class AbstractSituatedThing extends ThingInterface {

  environment = undefined

  constructor(environment) {
    this.environment = environment
  }

}
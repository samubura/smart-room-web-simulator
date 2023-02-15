const GridEnvironment = require('../../../../thing_models/simulated/smart-farming/GridEnvironment');
const exceptions = require('../../../../utils/thing-exceptions')
const ThingWrapper = require('../ThingWrapper')

const boundaries = {
  xMax: 3,
  xMin: 0,
  yMax: 3,
  yMin: 0,
}

class GridFieldEnvironmentWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, undefined)
    this.thing = new GridEnvironment(boundaries)
  }

  getEnvironment(){
    return this.thing;
  }

}

module.exports.create = (id, env) => new GridFieldEnvironmentWrapper(id)
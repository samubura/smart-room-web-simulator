const GridFieldEnvironment = require('../../../../thing_models/simulated/smart-farming/GridFieldEnvironment');
const exceptions = require('../../../../utils/thing-exceptions')
const ThingWrapper = require('../ThingWrapper')

//Instance Parameters
const boundaries = {
  xMax: 3,
  xMin: 0,
  yMax: 3,
  yMin: 0,
}

class GridFieldEnvironmentWrapper extends ThingWrapper {

  constructor(id) {
    super(id, undefined, 1, false)
    this.thing = new GridFieldEnvironment(boundaries)
  }

  getEnvironment(){
    return this.thing;
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case 'rain':
        this.thing.rain();
        return;
      case 'irrigate':
        this.thing.irrigate(data)
        return
      case 'dryAll':
        this.thing.dryAll();
        return;
      case 'dry':
        this.thing.dry(data)
        return
      default: 
        return exceptions.actionNotFound(this.id, actionName)
    }
  }

  getState(){
    return {
      boundaries: this.thing.getBoundaries(),
      field: this.thing.getField()
    }
  }

}


module.exports.create = (id, env) => new GridFieldEnvironmentWrapper(id)
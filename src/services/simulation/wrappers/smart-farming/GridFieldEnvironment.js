const GridFieldEnvironment = require('../../../../thing_models/simulated/smart-farming/GridFieldEnvironment');
const exceptions = require('../../../../utils/thing-exceptions')
const ThingWrapper = require('../ThingWrapper')


class GridFieldEnvironmentWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, undefined, 1)
    this.thing = new GridFieldEnvironment()
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
        this.thing.irrigate(data.x, data.y)
        return
      default: 
        return exceptions.actionNotFound(this.id, actionName)
    }
  }

}

module.exports.create = (id, env) => new GridFieldEnvironmentWrapper(id)
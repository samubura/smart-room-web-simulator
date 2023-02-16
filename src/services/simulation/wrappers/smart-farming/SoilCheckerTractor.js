const GridDirectionalMover = require('../../../../thing_models/simulated/smart-farming/GridDirectionalMover');
const exceptions = require('../../../../utils/thing-exceptions')
const ThingWrapper = require('../ThingWrapper')

class SoilCheckerTractorWrapper extends ThingWrapper {

  constructor(id, env, startingPosition, startingDirection) {
    super(id, env, 1, true)
    this.thing = new GridDirectionalMover(env.getEnvironment(), startingPosition, startingDirection)
  }
 
  async mapProperty(req, propertyName) {
    switch (propertyName) {
      case 'position':
        return await this.thing.getPosition()
      case 'direction':
        return await this.thing.getDirection()
      default:
        exceptions.propertyNotFound(this.id, propertyName)
    }
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case 'moveToField':
        if (data) {
          if(!this._isPosition(data)){
            return exceptions.badInput(this.id, actionName)
          }
          return await this.thing.move(data)
        } else {
          return exceptions.badInput(this.id, actionName)
        }
        default: 
          return exceptions.actionNotFound(this.id, actionName)
    }
  }

  getState(){
    return {
      position: this.thing.getPosition(),
      direction: this.thing.getDirection(),
    }
  }

  _isPosition(data){
    return data.x != undefined && data.y != undefined
  }
}

module.exports.create = (id, env) => new SoilCheckerTractorWrapper(id, env, {x: 1, y:1}, 0)
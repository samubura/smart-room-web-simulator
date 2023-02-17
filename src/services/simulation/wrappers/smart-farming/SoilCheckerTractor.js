const SoilCheckerTractor = require('../../../../thing_models/simulated/smart-farming/SoilCheckerTractor');
const exceptions = require('../../../../utils/thing-exceptions')
const ThingWrapper = require('../ThingWrapper')

const {ticksPerSecond} = require('../../../../../config')

//Instance Parameters
const startingPosition = {x: 0, y: 0}
const startingDirection = 0;

class SoilCheckerTractorWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, env, 1, true)
    this.thing = new SoilCheckerTractor(env.getEnvironment(), startingPosition, startingDirection)
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
          //convert ticks in seconds
          return this.thing.move(data) / ticksPerSecond
        } else {
          return exceptions.badInput(this.id, actionName)
        }
        case 'goHome':
          //convert ticks in seconds
          return this.thing.move(this.thing.getHomePosition()) / ticksPerSecond
        case 'checkSoilHumidity':
          return {humidity: this.thing.getSoilHumidity()}
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

module.exports.create = (id, env) => new SoilCheckerTractorWrapper(id, env)
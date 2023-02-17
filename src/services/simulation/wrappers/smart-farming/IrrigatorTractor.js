const IrrigatorTractor = require('../../../../thing_models/simulated/smart-farming/IrrigatorTractor');
const exceptions = require('../../../../utils/thing-exceptions')
const ThingWrapper = require('../ThingWrapper')

const {ticksPerSecond} = require('../../../../../config')

//Instance Parameters
const startingPosition = {x: 0, y: 0}
const startingDirection = 0;
const waterLevel = 10;

class IrrigatorTractorWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, env, 1, true)
    this.thing = new IrrigatorTractor(env.getEnvironment(), startingPosition, startingDirection, waterLevel)
  }
 
  async mapProperty(req, propertyName) {
    switch (propertyName) {
      case 'position':
        return this.thing.getPosition()
      case 'direction':
        return this.thing.getDirection()
      case 'waterLevel':
        return this.thing.getWaterLevel()
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
          return this.thing.move(data) / ticksPerSecond
        } else {
          return exceptions.badInput(this.id, actionName)
        }
      case 'goHome':
        return this.thing.move(this.thing.getHomePosition()) / ticksPerSecond
      case 'irrigate':
        if(this.thing.getWaterLevel() <= 0){
          return exceptions.forbidden(this.id, actionName);
        }
        return this.thing.irrigate()
      case 'refillWater':
        let position = this.thing.getPosition() 
        let home = this.thing.getHomePosition()
        if(position.x != home.x || position.y != home.y){
          return exceptions.forbidden(this.id, actionName)
        }
        return this.thing.refillWater()
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

module.exports.create = (id, env) => new IrrigatorTractorWrapper(id, env)
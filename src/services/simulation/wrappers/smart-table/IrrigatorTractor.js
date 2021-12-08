const Tractor = require("./Tractor");
const exceptions = require('../../../../utils/thing-exceptions')
const axios = require('axios')
const eventService = require("../../../event-service")

const tractorIp = "http://10.2.2.240";
const startingPosition = -6
const startingDirection = 0


class IrrigatorTractor extends Tractor {

  waterLevel

  constructor(id, env){
    super(id, 0, true, tractorIp, startingPosition, startingDirection)
  }

  async init(){
    //await this._getWaterLevel();
  }

  async mapProperty(req, propertyName) {
    try {
      return await super.mapProperty(req, propertyName)
    } catch {
      //continue switching
      switch(propertyName){
        case 'waterLevel': return this._getWaterLevel()
        default: exceptions.propertyNotFound(this.id, propertyName)
      }
    }
    
  }

  async mapAction(req, actionName, data) {
    try {
      return await super.mapAction(req, actionName, data)
    } catch {
      //continue switching
      switch(actionName){
        case 'irrigate': {
          if(this.waterLevel <= 0){
            exceptions.forbidden(this.id, "use", actionName)
          }
          return await this._irrigate() 
        }
        case 'refillWater': {
          if(this.position != this.homePosition){
            exceptions.forbidden(this.id, "use", actionName)
          }
          return await this._refillWater()
        };
        default: exceptions.propertyNotFound(this.id, propertyName)
      }
    }
  }

  async _irrigate(){
    var url = `${this.ip}/actions/irrigate`
    var body = {duration: 3};
    await axios.post(url, body)
    await this._getWaterLevel()
    return;
  }

  async _refillWater(){
    var url = `${this.ip}/actions/refillwater`
    await axios.post(url)
    await this._getWaterLevel()
    return;
  }

  async _getWaterLevel(){
    var url = `${this.ip}/properties/waterlevel`
    var res = await axios.get(url)
    this.waterLevel = Math.floor(res.data/3);
    return this.waterLevel;
  }

}

module.exports.create = (id, env) => new IrrigatorTractor(id, env)
const Tractor = require("./Tractor");
const exceptions = require('../../../../utils/thing-exceptions')
const axios = require('axios')
const eventService = require("../../../event-service")

const tractorIp = "http://10.2.2.157";
const startingPosition = -1
const startingDirection = 0


class SoilCheckerTractor extends Tractor {
  constructor(id, env){
    super(id, 0, true, tractorIp, startingPosition, startingDirection)
  }

  async mapAction(req, actionName, data) {
    try {
      return await super.mapAction(req, actionName, data)
    } catch {
      //continue switching
      switch(actionName){
        case 'checkSoilHumidity': {
          return await this._checkSoilHumidity()
        }
        default: exceptions.propertyNotFound(this.id, propertyName)
      }
    }
  }
  
  async _checkSoilHumidity(){
    var url = `${this.ip}/properties/soilcondition`
    var res = await axios.get(url)
    console.log(res.data)
    return {humidity: res.data.moisture};
  }
}

module.exports.create = (id, env) => new SoilCheckerTractor(id, env)
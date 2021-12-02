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
}

module.exports.create = (id, env) => new SoilCheckerTractor(id, env)
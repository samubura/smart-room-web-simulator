const Tractor = require("./Tractor");
const exceptions = require('../../../../utils/thing-exceptions')
const axios = require('axios')
const eventService = require("../../../event-service")

const tractorIp = "http://10.2.2.130";
const startingPosition = 4


class IrrigatorTractor extends Tractor {
  constructor(id, env){
    super(id, 0, true, tractorIp, startingPosition)
  }
}

module.exports.create = (id, env) => new IrrigatorTractor(id, env)
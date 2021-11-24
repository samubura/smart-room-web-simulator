const eventService = require('../../event-service')
class ThingWrapper {

  thing = undefined
  id = undefined
  env = undefined
  eventTickRate = 1
  ticksFromLastEvent = 0;
  actionEvent = true

  constructor(id, env, eventTickRate = 1, actionEvent = true) {
    this.id = id
    this.env = env
    this.eventTickRate = eventTickRate
    this.actionEvent = actionEvent
  }


  readProperty(req, propertyName) {
    var res = this.mapProperty(req, propertyName)
    return res
  }

  invokeAction(req, actionName, data) {
    var res = this.mapAction(req, actionName, data)
    if (this.actionEvent) {
      this.publishUpdate()
    }
    return res
  }

  propertyNotFound(propertyName) {
    throw {
      code: 404,
      message: `Thing ${this.id} does not have property ${propertyName}`
    }
  }

  unauthorized(operation,affordanceName) {
    throw {
      code: 401,
      message: `Authorization is required to ${operation} ${affordanceName} on thing ${this.id}`
    }
  }

  forbidden(operation,affordanceName) {
    throw {
      code: 403,
      message: `Forbidden ${operation} of ${affordanceName} on thing ${this.id}`
    }
  }

  actionNotFound(actionName) {
    throw {
      code: 404,
      message: `Thing ${this.id} does not have action ${actionName}`
    }
  }

  badInput(affordanceName) {
    throw {
      code: 400,
      message: `Input for ${affordanceName} on thing ${this.id} was not correct`
    }
  }

  publishUpdate() {
    eventService.publish("thing-update", {
      id: this.id,
      state: this.thing
    })
  }

  tick() {
    this.ticksFromLastEvent ++;
    this.thing.tick()
    if (this.eventTickRate == this.ticksFromLastEvent){
      this.publishUpdate()
      this.ticksFromLastEvent = 0;
    }
  }

  //abstract
  mapProperty(propertyName) {
    this.propertyNotFound(propertyName)
  }

  //abstract
  mapAction(actionName, body) {
    this.actionNotFound(actionName)
  }

}

module.exports = ThingWrapper
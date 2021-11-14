const eventService = require('../../event-service')
class ThingWrapper {

  thing = undefined
  id = undefined
  env = undefined
  tickEvent = true
  actionEvent = true

  constructor(id, env, tickEvent = true, actionEvent = true) {
    this.id = id
    this.env = env
    this.tickEvent = tickEvent
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
    this.thing.tick()
    if (this.tickEvent) {
      this.publishUpdate()
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
//interface
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


  readProperty(propertyName) {
    var res = this.mapProperty(propertyName)
    return res
  }

  invokeAction(actionName, data) {
    var res = this.mapAction(actionName, data)
    if (this.actionEvent) {
      this.publishThing()
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

  publishThing() {
    eventService.publish("thing-update", {
      id: this.id,
      thing: this.thing
    })
  }

  tick() {
    this.thing.tick()
    if (this.tickEvent) {
      this.publishThing()
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
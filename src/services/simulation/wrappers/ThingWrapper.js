const exceptions = require('../../../utils/thing-exceptions')
const eventService = require('../../event-service')

class ThingWrapper {
  id = undefined
  eventTickRate = 0
  ticksFromLastEvent = 0;
  actionEvent = true
  thing = undefined
  environment = undefined
  eventService = eventService

  constructor(id, env, eventTickRate = 0, actionEvent = true) {
    this.id = id
    this.eventTickRate = eventTickRate
    this.actionEvent = actionEvent
    this.environment = env
  }

  async init(env) {
    //put here some initialization for the wrapper
  }

  async readProperty(req, propertyName) {
    var res = await this.mapProperty(req, propertyName)
    return res
  }

  async invokeAction(req, actionName, data) {
    var res = await this.mapAction(req, actionName, data)
    if (this.actionEvent) {
      this.publishStateUpdate()
    }
    return res
  }

  async tick() {
    if (this.thing) {
      this.thing.tick()
    }
    this.ticksFromLastEvent++;
    if (this.eventTickRate == this.ticksFromLastEvent) {
      await this.publishStateUpdate()
      this.ticksFromLastEvent = 0;
    }
  }

  async publishStateUpdate() {
    eventService.publish("thing-update", {
      id: this.id,
      state: this.thing
    })
  }

  //abstract
  async mapProperty(req, propertyName) {
    exceptions.propertyNotFound(propertyName)
  }

  //abstract
  async mapAction(actionName, body) {
    exceptions.actionNotFound(actionName)
  }
}

module.exports = ThingWrapper
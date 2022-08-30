const exceptions = require('../../../utils/thing-exceptions')

class ThingWrapper {
  id = undefined
  eventTickRate = 0
  ticksFromLastEvent = 0;
  actionEvent = true
  thing = undefined
  environment = undefined

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
      this.publishUpdate()
    }
    return res
  }

  async tick() {
    if (this.thing) {
      this.thing.tick()
    }
    this.ticksFromLastEvent++;
    if (this.eventTickRate == this.ticksFromLastEvent) {
      await this.publishUpdate()
      this.ticksFromLastEvent = 0;
    }
  }

  async publishUpdate() {
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
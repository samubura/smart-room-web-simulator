const eventService = require('../../event-service')
const exceptions = require('../../../utils/thing-exceptions')
const ThingWrapper = require('./ThingWrapper')

class SimulationThingWrapper extends ThingWrapper {

  thing = undefined
  env = undefined

  constructor(id, env, eventTickRate = 1, actionEvent = true) {
    super(id, eventTickRate, actionEvent)
    this.env = env;
  }

  async init(env) {
    //put here some initialization for the thing
  }

  //override
  async tick() {
    if (this.thing) {
      this.ticksFromLastEvent++;
      this.thing.tick()
      if (this.eventTickRate == this.ticksFromLastEvent) {
        await this.publishUpdate()
        this.ticksFromLastEvent = 0;
      }
    }
  }

  //override
  async publishUpdate() {
    eventService.publish("thing-update", {
      id: this.id,
      state: this.thing
    })
  }

  //abstract
  async mapProperty(propertyName) {
    exceptions.propertyNotFound(propertyName)
  }

  //abstract
  async mapAction(actionName, body) {
    exceptions.actionNotFound(actionName)
  }
}

module.exports = SimulationThingWrapper
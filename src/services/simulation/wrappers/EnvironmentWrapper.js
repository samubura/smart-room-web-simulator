//interface
const eventService = require('../../event-service')
const ThingWrapper = require('./ThingWrapper')

class EnvironmentWrapper extends ThingWrapper {

  constructor(id, env, tickRate=1, actionEvent = true) {
    super(id, env, tickRate, actionEvent)
  }

  publishThing() {
    eventService.publish("environment-update", {
      id: this.id,
      thing: this.thing
    })
  }

  propertyNotFound(propertyName) {
    throw {
      code: 404,
      message: `Environment does not have property ${propertyName}`
    }
  }

  actionNotFound(actionName) {
    throw {
      code: 404,
      message: `Environment does not have action ${actionName}`
    }
  }

  badInput(affordanceName) {
    throw {
      code: 400,
      message: `Input for ${affordanceName} on environment was not correct`
    }
  }

}

module.exports = EnvironmentWrapper
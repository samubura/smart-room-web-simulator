const Lamp = require("../../../models/Lamp");
const SimulationThingWrapper = require("./SimulationThingWrapper");
const exceptions = require('../../../utils/thing-exceptions')

class LampWrapper extends SimulationThingWrapper {

  constructor(id, env) {
    super(id, env, 0)
  }

  async init(env) {
    //since Lamp is not a situated thing ignore the env
    this.thing = new Lamp()
  }

  async mapProperty(req, propertyName) {
    switch (propertyName) {
      case 'color':
        return await this.thing.getColor()
      case 'state':
        return await this.thing.getState()
      default:
        exceptions.propertyNotFound(propertyName)
    }
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case 'setColor':
        if (data.color) {
          await this.thing.setColor(data.color)
          return await this.thing.getColor();
        } else {
          exceptions.badInput(actionName)
        }
        case 'toggle':
          await this.thing.toggle()
          return await this.thing.getState();
        default:
          exceptions.actionNotFound(actionName)
    }
  }

}

module.exports.create = (id, env) => new LampWrapper(id, env)
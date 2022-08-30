const Lamp = require('../../../../thing_models/simulated/Lamp');
const exceptions = require('../../../../utils/thing-exceptions')
const ThingWrapper = require('../ThingWrapper')

class LampWrapper extends ThingWrapper {

  constructor(id, env) {
    //eventTickRate is 0 so no event will be pushed periodically
    //actionEvent is true so events will be triggered when actions are invoked
    super(id, env, 0, true)
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
        exceptions.propertyNotFound(this.id, propertyName)
    }
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case 'setColor':
        if (data.color) {
          await this.thing.setColor(data.color)
          return await this.thing.getColor();
        } else {
          exceptions.badInput(this.id, actionName)
        }
        case 'toggle':
          await this.thing.toggle()
          return await this.thing.getState();
        default:
          exceptions.actionNotFound(this.id, actionName)
    }
  }

}

module.exports.create = (id, env) => new LampWrapper(id, env)
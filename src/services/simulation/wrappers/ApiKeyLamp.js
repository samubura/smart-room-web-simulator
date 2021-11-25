const Lamp = require("../../../models/Lamp");
const SimulationThingWrapper = require("./SimulationThingWrapper");
const exceptions = require('../../../utils/thing-exceptions')

class ApiKeyLampWrapper extends SimulationThingWrapper {

  constructor(id, env) {
    super(id, env, 0)
  }

  async init(env) {
    //since Lamp is not a situated thing ignore the env
    this.thing = new Lamp()
  }

  _checkAuthorization(req, operation, property) {
    if (!req.headers['x-credentials']) {
      return this.unauthorized(operation, property)
    }
    if (req.headers['x-credentials'] != 'opensesame') { //TODO change
      return this.forbidden(operation, property)
    }
  }


  async mapProperty(req, propertyName) {
    _checkAuthorization(req, "read", property)
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
    _checkAuthorization(req, "use", property)
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

module.exports.create = (id, env) => new ApiKeyLampWrapper(id, env)
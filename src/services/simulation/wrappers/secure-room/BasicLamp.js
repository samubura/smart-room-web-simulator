const Lamp = require("../../../models/Lamp");
const exceptions = require('../../../utils/thing-exceptions');
const SecureThingWrapper = require("../SecureThingWrapper");

class BasicLampWrapper extends SecureThingWrapper {

  constructor(id, env) {
    super(id, env, 0, true)
  }

  async init(env) {
    //since Lamp is not a situated thing ignore the env
    this.thing = new Lamp()
  }

  async checkAuthorization(req, operation, property) {
    if (!req.headers['authorization']) {
      return exceptions.unauthorized(operation, property)
    }
    if (req.headers['authorization'].replace("Basic ", "") != 'dXNlcm5hbWU6cGFzc3dvcmQ=') { //TODO change
      return exceptions.forbidden(operation, property)
    }
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

module.exports.create = (id, env) => new BasicLampWrapper(id, env)
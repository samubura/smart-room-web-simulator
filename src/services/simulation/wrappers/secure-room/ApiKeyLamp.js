const Lamp = require("../../../../models/Lamp");
const exceptions = require('../../../../utils/thing-exceptions');
const ApiKeyHeaderThingWrapper = require("../ApiKeyHeaderThingWrapper");

class ApiKeyLampWrapper extends ApiKeyHeaderThingWrapper {

  constructor(id, env) {
    super(id, env, 0, true, "x-credentials", "opensesame")
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

module.exports.create = (id, env) => new ApiKeyLampWrapper(id, env)
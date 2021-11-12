const Lamp = require("../../../models/Lamp");
const ThingWrapper = require("./ThingWrapper");

class LampWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, env, false)

    //since Lamp is not a situated thing ignore the env
    this.thing = new Lamp()
  }


  mapProperty(propertyName) {
    switch (propertyName) {
      case 'color':
        return this.thing.getColor()
      case 'state':
        return this.thing.getState()
      default:
        this.propertyNotFound(propertyName)
    }
  }

  mapAction(actionName, data) {
    switch (actionName) {
      case 'setColor':
        if (data.color) {
          this.thing.setColor(data.color)
          return {color: this.thing.getColor()}
        } else {
          this.badInput(actionName)
        }
        case 'toggle': 
          this.thing.toggle()
          return this.thing.getState()
        default:
          this.actionNotFound(actionName)
    }
  }

}

module.exports.create = (id, env) => new LampWrapper(id, env)
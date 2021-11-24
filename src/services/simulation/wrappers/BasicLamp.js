const Lamp = require("../../../models/Lamp");
const ThingWrapper = require("./ThingWrapper");

class BasicLampWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, env, 0)

    this.thing = new Lamp()
  }

  _checkAuthorization(req, operation, property){
    if(!req.headers['authorization']){
      return this.unauthorized(operation, property)
    }
    if(req.headers['authorization'].replace("Basic ", "") != 'dXNlcm5hbWU6cGFzc3dvcmQ='){ //TODO change
      return this.forbidden(operation, property)
    }
  }

  mapProperty(req, propertyName) {
    this._checkAuthorization(req, "read", propertyName)
    switch (propertyName) {
      case 'color':
        return {rgb: this.thing.getColor()}
      case 'state':
        return this.thing.getState()
      default:
        this.propertyNotFound(propertyName)
    }
  }

  mapAction(req, actionName, data) {
    this._checkAuthorization(req, "invoke", actionName)
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

module.exports.create = (id, env) => new BasicLampWrapper(id, env)
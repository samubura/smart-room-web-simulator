const Lamp = require("../../../models/Lamp");
const ThingWrapper = require("./ThingWrapper");

class LampWrapper extends ThingWrapper {

  constructor(id, env){
    super(id, env, false)
    
    //since Lamp is not a situated thing ignore the env
    this.thing = new Lamp()
  }

  
  mapProperty(propertyName){
    switch(propertyName){
      case 'color': return this.thing.getColor()
      case 'status': return this.thing.getStatus()
      default: this.propertyNotFound(propertyName)
    }
  }

  mapAction(actionName, data){
    switch(actionName){
      case 'setColor': if(data.color){
        return this.thing.setColor(data.color)
      } else {
        this.badInput(actionName)
      }
      case 'toggle': return this.thing.toggle()
      default: this.actionNotFound(actionName)
    }
  }

}

module.exports.create = (id, env) => new LampWrapper(id, env) 
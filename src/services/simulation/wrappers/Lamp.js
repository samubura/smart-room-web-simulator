const Lamp = require("../../../models/Lamp");
const ThingWrapper = require("./ThingWrapper");

class LampWrapper extends ThingWrapper {

  constructor(id){
    super(id, false)
    this.thing = new Lamp(id)
  }

  
  mapProperty(propertyName){
    switch(propertyName){
      case 'color': return this.thing.getColor()
      case 'status': return this.thing.getStatus()
      default: throw {
        code: 404,
        message:`Thing ${this.id} does not have property ${propertyName}`
      }
    }
  }

  mapAction(actionName, data){
    switch(actionName){
      case 'setColor': if(data.color){
        return this.thing.setColor(data.color)
      } else {
        throw {
          code: 400,
          message: `Incorrect data for action ${actionName}`
        }
      }
      case 'toggle': return this.thing.toggle()
      default: throw {
        code: 404,
        message:`Thing ${this.id} does not have action ${actionName}`
      }
    }
  }

}

module.exports.create = (id) => new LampWrapper(id)
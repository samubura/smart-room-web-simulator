const ThingWrapper = require("../ThingWrapper");
const exceptions = require('../../../../utils/thing-exceptions')
const HttpHueLamp = require("../../../../thing_models/proxy/HttpHueLamp");

class HttpHueLampWrapper extends ThingWrapper {

  currentProperties = undefined;

  constructor(id) {
    super(id, 5)
    this.thing = new HttpHueLamp(2);
  }

  async init() {
    this.currentProperties = await this.thing.getRealLampProperties();
  }

  async publishStateUpdate(){
    await this.init()
    super.publishStateUpdate(this.currentProperties)
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
        if (data) {
          if(this.isHex(data.color)){
            await this.thing.setColor(data.color)
            return
          }
        } else {
          exceptions.badInput(this.id, actionName)
        }
        case 'toggle':
          await this.thing.toggle();
          return
        default:
          exceptions.actionNotFound(this.id, actionName)
    }
  }

  isHex(string){
    let regex = new RegExp("^#([A-Fa-f0-9]{6})$");
    return regex.test(string)
  }
  
}

module.exports.create = (id, env) => new HttpHueLampWrapper(id, env)
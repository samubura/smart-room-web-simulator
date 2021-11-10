//interface
const eventService = require('../../event-service')
class ThingWrapper {

  thing = undefined
  id = undefined
  tickEvent = true
  actionEvent = true

  constructor(id, tickEvent = true, actionEvent = true){
    this.id = id
    this.tickEvent = tickEvent
    this.actionEvent = actionEvent
  }


  readProperty(propertyName){
    var res = this.mapProperty(propertyName)
    return res
  }

  invokeAction(actionName, data){
    var res = this.mapAction(actionName, data)
    if(this.actionEvent) {
      this.publishThing()
    }
    return res
  }

  publishThing(){
    eventService.publish("thing-update", {
      id: this.id,
      thing: this.thing
    })
  }

  //abstract
  mapProperty(propertyName){
    return undefined
  }

  //abstract
  mapAction() {
    return undefined
  }

  tick(){
    this.thing.tick()
    if(this.tickEvent){
      this.publishThing()
    }
  }
}

module.exports = ThingWrapper
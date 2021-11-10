const { ok, notFound } = require('../utils/action-results')
const {publish} = require('../services/event-service')
const simulation = require('../services/simulation')


module.exports.getColor = function(req){
  var lamp = simulation.getThing(req.params.id)
  if(!lamp){
    return notFound("Could not found lamp")
  }
  return ok(lamp.getColor())
}

module.exports.getStatus = function(req){
  var lamp = simulation.getThing(req.params.id)
  if(!lamp){
    return notFound("Could not found lamp")
  }
  return ok(lamp.getStatus())
}

module.exports.setColor = function(req){
  var lamp = simulation.getThing(req.params.id)
  if(!lamp){
    return notFound("Could not found lamp")
  }
  lamp.setColor(req.body.color);
  publish("lamp-event", {
    id: req.params.id,
    type:"setColor", 
    data: {
      color: req.body.color
    }
  })
  return ok()
}

module.exports.toggleStatus = function(req){
  var lamp = simulation.getThing(req.params.id)
  if(!lamp){
    return notFound("Could not found lamp")
  }
  lamp.toggle()
  var status = lamp.getStatus();
  publish("lamp-event", {
    id: req.params.id,
    type:"toggle", 
    data: {
      status:  status
    }
  })
  return ok()
}
const fs = require('fs')
const path = require('path')
const config = require('../../../config')
let simulationThings = {}


function simulate(){
  for(t in simulationThings){
    simulationThings[t].tick()
  }
  setTimeout(simulate, 1000/config.ticksPerSecond)
}


module.exports.start = function(tdFolder) {
  var things = fs.readdirSync(path.join('..', 'td', tdFolder));
  things.forEach(t => {
    var td = JSON.parse(fs.readFileSync(path.join('..', 'td', tdFolder, t),'utf8'));
    var id = path.parse(t).name
    var thing = require('./wrappers/'+td.title).create(id)
    simulationThings[id] = thing
  })
  simulate();
}

module.exports.getThing = function(thingId) {
  return simulationThings[thingId]
}


module.exports.readProperty = function(thingId, property) {
  return this.getThing(thingId).readProperty(property)
}

module.exports.invokeAction = function(thingId, action, data) {
  return this.getThing(thingId).invokeAction(action, data)
}
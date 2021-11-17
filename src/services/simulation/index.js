const fs = require('fs')
const path = require('path')
const config = require('../../../config')
var simulationThings = {}
var environment = undefined; //TODO change


function simulate() {
  //update the env
  if (environment) {
    environment.tick()
  }
  //update the things
  for (t in simulationThings) {
    simulationThings[t].tick()
  }
  setTimeout(simulate, 1000 / config.ticksPerSecond)
}


module.exports.start = function (tdFolder) {
  var things = fs.readdirSync(path.join('..', 'td', tdFolder));

  //if there is an environment definition
  var envFile = path.join('..', 'td', tdFolder, 'environment.json')
  if (fs.existsSync(envFile)) {
    //Instantiate the environment as any WrappedThing that will be updated first and passed to the other ones
    var envTD = JSON.parse(fs.readFileSync(envFile, 'utf8'));
    environment = require('./wrappers/' + envTD['@type']).create(id, undefined)
  } else {
    //else leave that undefined
    environment = undefined;
  }

  //Instantiate the things
  things.forEach(t => {
    var td = JSON.parse(fs.readFileSync(path.join('..', 'td', tdFolder, t), 'utf8'));
    var id = td.title
    var thing = require('./wrappers/' + td['@type']).create(id, environment)
    simulationThings[id] = thing
  })
  simulate();
}

module.exports.getThing = function (thingId) {
  return simulationThings[thingId]
}

module.exports.readProperty = function (req, thingId, property) {
  return this.getThing(thingId).readProperty(req, property)
}

module.exports.invokeAction = function (req, thingId, action, data) {
  return this.getThing(thingId).invokeAction(req, action, data)
}

module.exports.publishUpdate = function(){
  if(environment){
    environment.publishUpdate()
  }
  for (t in simulationThings) {
    simulationThings[t].publishUpdate()
  }
}
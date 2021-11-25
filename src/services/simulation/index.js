const fs = require('fs')
const path = require('path')
const config = require('../../../config')
var simulationThings = {}
var environment = undefined; //TODO change


async function simulate() {
  //update the env
  if (environment) {
    await environment.tick()
  }
  //update the things
  for (t in simulationThings) {
    await simulationThings[t].tick()
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

  //Instantiate the things and sync initialization
  things.forEach(t => {
    var td = JSON.parse(fs.readFileSync(path.join('..', 'td', tdFolder, t), 'utf8'));
    var id = td.title
    var thing = require('./wrappers/' + td['@type']).create(id, environment)
    thing.init(environment).then(() => {
      simulationThings[id] = thing
    });
  })
  simulate();
}

module.exports.getThing = function (thingId) {
  return simulationThings[thingId]
}

module.exports.readProperty = async function (req, thingId, property) {
  return await this.getThing(thingId).readProperty(req, property)
}

module.exports.invokeAction = async function (req, thingId, action, data) {
  return await this.getThing(thingId).invokeAction(req, action, data)
}

module.exports.publishUpdate = async function(){
  if(environment){
    await environment.publishUpdate()
  }
  for (t in simulationThings) {
    await simulationThings[t].publishUpdate()
  }
}
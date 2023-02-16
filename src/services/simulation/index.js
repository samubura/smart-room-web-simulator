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


module.exports.start = function (workspace) {
  var things = fs.readdirSync(path.join('..', 'td', workspace));

  //if there is an environment definition
  var envFile = path.join('..', 'td', workspace, 'environment.json')
  if (fs.existsSync(envFile)) {
    //Instantiate the environment as a wrapped thing that will be updated first and passed to the other ones
    var envTD = JSON.parse(fs.readFileSync(envFile, 'utf8'));
    var id = envTD.title
    environment = require('./wrappers/' + workspace +'/'+ envTD['@type']).create(id, undefined)
  } else {
    //else leave that undefined
    environment = undefined;
  }

  //Instantiate the things and sync initialization
  things.forEach(t => {
    var td = JSON.parse(fs.readFileSync(path.join('..', 'td', workspace, t), 'utf8'));
    var id = td.title
    var thing = require('./wrappers/' + workspace + '/' + td['@type']).create(id, environment)
    thing.init().then(() => {
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
  for (t in simulationThings) {
    await simulationThings[t].publishStateUpdate()
  }
}
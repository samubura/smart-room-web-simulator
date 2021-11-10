const fs = require('fs')
const path = require('path')
let simulationThings = {}


module.exports.start = function(tdFolder) {
  var things = fs.readdirSync(path.join('..', 'td', tdFolder));
  things.forEach(t => {
    var td = JSON.parse(fs.readFileSync(path.join('..', 'td', tdFolder, t),'utf8'));
    var id = path.parse(t).name
    var thing = require('../models/'+td.title).create(id)
    simulationThings[id] = thing
  })
}

module.exports.getThing = function(thingId) {
  return simulationThings[thingId]
}
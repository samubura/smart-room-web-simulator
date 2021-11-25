const fs = require('fs');
const path = require('path');
const { ok, notFound } = require('../utils/action-results');
const { workspace } = require('../../config')

exports.getThingDescription = function (req) {
  try {
    var td = JSON.parse(fs.readFileSync(path.join("..", "td", workspace, req.params.id + '.json'), 'utf8'));
  } catch (error) {
    return notFound("Could not find thing " + req.params.id);
  }
  return ok(td)
}

exports.getThings = function (req) {
  console.log(req.headers)
  var base = "http://" + req.headers.host + req.url + "/"
  var things = fs.readdirSync(path.join("..", "td", workspace));
  things = things.map(x => {
    return {
      id: path.parse(x).name,
      uri: `${base}${path.parse(x).name}`
    }
  });
  return ok(things)
}

//return only the active workspace right now
exports.getWorkspaces = function(req){
  var base = "http://" + req.headers.host
  return ok([{id: workspace, uri:`${base}/workspaces/${workspace}`}])
}
const simulation = require('../services/simulation')
const {publish} = require('../services/event-service')
const { ok, notFound, error} = require('../utils/action-results')
const fs = require('fs')
const path = require('path')

const tdFolder = require('../../config').workspace

function findPropertyName(thingId, reqForm){
  var td = JSON.parse(fs.readFileSync(path.join('..', 'td', tdFolder, thingId+".json"), 'utf8'));
  var name = undefined
  for(p in td.properties){
    var form = td.properties[p].forms[0].href
    if(form == reqForm){
      name = p
    }
  }
  return name;
}


function findActionName(thingId, reqForm){
  var td = JSON.parse(fs.readFileSync(path.join('..', 'td', tdFolder, thingId+".json"), 'utf8'));
  var name = undefined
  for(p in td.actions){
    var form = td.actions[p].forms[0].href
    if(form == reqForm){
      name = p
    }
  }
  return name;
}


function getAgentId(req){
  return req.headers['x-agent-id']
}

function logInteraction(req, affordance, type) {
  var agentId = getAgentId(req)
  publish("agent-interaction", {agentId, affordance, thingId: req.params.thingId, type});
}


exports.readProperty = async function (req) {
  try {
    var propertyName = findPropertyName(req.params.thingId, req.params.form)
    if(!propertyName){
      return notFound(`${req.url} not found`)
    }
    var res = await simulation.readProperty(req, req.params.thingId, propertyName)
    logInteraction(req, propertyName, "read property")
    return ok(res)
  } catch (e) {
    return error(e);
  }
}

exports.invokeAction = async function (req) {
  try {
    var actionName = findActionName(req.params.thingId, req.params.form)
    if(!actionName){
      return notFound(`${req.url} not found`)
    }
    var res = await simulation.invokeAction(req, req.params.thingId, actionName, req.body)
    logInteraction(req, actionName, "invoked action")
    return ok(res)
  } catch (e) {
    return error(e);
  }
}
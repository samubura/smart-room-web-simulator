const simulation = require('../services/simulation')
const {publish} = require('../services/event-service')
const { ok, notFound, badRequest, internalServerError } = require('../utils/action-results')
const fs = require('fs')
const path = require('path')

const tdFolder = require('../../config').workspace

function findPropertyName(thingId, reqForm){
  var td = JSON.parse(fs.readFileSync(path.join('..', 'td', tdFolder, thingId+".json"), 'utf8'));
  var name = undefined
  for(p in td.properties){
    var form = td.properties[p].forms[0].href
    if(form == '/'+reqForm){
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
    if(form == '/'+reqForm){
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


exports.readProperty = function (req) {
  try {
    var propertyName = findPropertyName(req.params.thingId, req.params.form)
    if(!propertyName){
      return notFound(`${req.url} not found`)
    }

    logInteraction(req, propertyName, "read property")
    var res = simulation.readProperty(req.params.thingId, propertyName)
    
    return ok(res)
  } catch (error) {
    if (error.code == 404) {
      return notFound(error.message)
    }
    return internalServerError(error)
  }
}

exports.invokeAction = function (req) {
  try {
    var actionName = findActionName(req.params.thingId, req.params.form)
    if(!actionName){
      return notFound(`${req.url} not found`)
    }

    logInteraction(req, actionName, "invoked action")

    var res = simulation.invokeAction(req.params.thingId, actionName, req.body)
    return ok(res)
  } catch (error) {
    if (error.code == 404) {
      return notFound(error.message)
    }
    if (error.code == 400) {
      return badRequest(error.message)
    }
    return internalServerError(error)
  }
}
const simulation = require('../services/simulation')
const { ok, notFound, badRequest, internalServerError } = require('../utils/action-results')

exports.readProperty = function (req) {
  try {
    var res = simulation.readProperty(req.params.thingId, req.params.affordance)
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
    var res = simulation.invokeAction(req.params.thingId, req.params.affordance, req.body)
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
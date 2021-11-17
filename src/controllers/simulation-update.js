const { ok } = require("../utils/action-results")
const simulation = require("../services/simulation")

exports.publishUpdate = function (req) {
  simulation.publishUpdate();
  return ok()
}
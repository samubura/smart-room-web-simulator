const { mapControllerRoutes, action } = require('./route-utils')
const { ok } = require('../utils/action-results')
const ws = require('../../config').workspace

module.exports = mapControllerRoutes('thing-descriptions', function (app, controller) {
  app.route('/workspaces')
    .get(action(controller.getWorkspaces))

  app.route('/workspaces/'+ws+'/things/')
    .get(action(controller.getThings))

  app.route('/workspaces/'+ws+'/things/:id')
    .get(action(controller.getThingDescription))
})
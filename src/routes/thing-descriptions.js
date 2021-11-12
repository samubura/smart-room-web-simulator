const { mapControllerRoutes, action } = require('./route-utils')
const { ok } = require('../utils/action-results')
const ws = require('../../config').workspace

module.exports = mapControllerRoutes('thing-descriptions', function (app, controller) {
  app.route('/workspace')
    .get(action((req) => {
      return ok({id: ws})
    }))

  app.route('/workspace/'+ws+'/things/')
    .get(action(controller.getThings))

  app.route('/workspace/'+ws+'/things/:id')
    .get(action(controller.getThingDescription))
})
const { mapControllerRoutes, action } = require('./route-utils')
const ws = require('../../config').workspace

module.exports = mapControllerRoutes('thing-descriptions', function (app, controller) {
  app.route('/'+ws+'/things/')
    .get(action(controller.getThings))

  app.route('/'+ws+'/things/:id')
    .get(action(controller.getThingDescription))
})
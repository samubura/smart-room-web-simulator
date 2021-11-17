const { mapControllerRoutes, action } = require('./route-utils')

module.exports = mapControllerRoutes('simulation-update', function (app, controller) {
  app.route('/simulation/publish-update')
    .post(action(controller.publishUpdate))
})
const { mapControllerRoutes, action } = require('./route-utils')

module.exports = mapControllerRoutes('lamp-thing', function (app, controller) {
  app.route('/lamps/:id/status')
    .get(action(controller.getStatus))

  app.route('/lamps/:id/color')
    .get(action(controller.getColor))
    .post(action(controller.setColor))

  app.route('/lamps/:id/toggle')
    .post(action(controller.toggleStatus))
})
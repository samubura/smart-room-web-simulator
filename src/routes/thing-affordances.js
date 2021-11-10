const { mapControllerRoutes, action } = require('./route-utils')

module.exports = mapControllerRoutes('thing-affordances', function (app, controller) {
  app.route('/affordances/:thingId/:affordance')
    .get(action(controller.readProperty))
    .post(action(controller.invokeAction))
})
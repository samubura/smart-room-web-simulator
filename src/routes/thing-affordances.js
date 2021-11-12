const { mapControllerRoutes, action } = require('./route-utils')

module.exports = mapControllerRoutes('thing-affordances', function (app, controller) {
  app.route('/affordances/:ws/:thingId/:form(*)')
    .get(action(controller.readProperty))
    .post(action(controller.invokeAction))
})
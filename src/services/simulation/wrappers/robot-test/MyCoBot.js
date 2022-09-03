const MyCoBot = require("../../../models/MyCoBot");
const ThingWrapper = require("../ThingWrapper");

class MyCobotWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, env, 0)

    this.thing = new MyCoBot()
  }

  mapProperty(req, propertyName) {
    switch (propertyName) {
      default:
        this.propertyNotFound(propertyName)
    }
  }

  mapAction(req, actionName, data) {
    switch (actionName) {
        default:
          this.actionNotFound(actionName)
    }
  }

}

module.exports.create = (id, env) => new MyCobotWrapper(id, env)
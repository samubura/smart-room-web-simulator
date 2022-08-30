const exceptions = require("../../../utils/thing-exceptions")
const ThingWrapper = require("./ThingWrapper")

class SecureThingWrapper extends ThingWrapper {

  //abstract
  async checkAuthorization(req, operation, affordance) { 
    return exceptions.unauthorized(operation, affordance)
  }

  async readProperty(req, propertyName) {
    await this.checkAuthorization(req, "read", property)
    super.readProperty(req, propertyName)
  }

  async invokeAction(req, actionName, data) {
    await this.checkAuthorization(req, "use", property)
    super.invokeAction(req, actionName, data)
  }
}

module.exports = SecureThingWrapper
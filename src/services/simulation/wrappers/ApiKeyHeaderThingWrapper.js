const { forbidden, unauthorized } = require("../../../utils/thing-exceptions")
const SecureThingWrapper = require("./SecureThingWrapper")

class ApiKeyHeaderThingWrapper extends SecureThingWrapper {

    apikey = undefined
    headerName = undefined

    constructor(id, env, eventTickRate = 0, actionEvent = true, headername, apikey) {
      super(id, env, eventTickRate, actionEvent)
      this.apikey = apikey
      this.headerName = headername
    }

    async checkAuthorization(req, operation, affordance) {
      if (!req.headers[this.headerName]) {
        return unauthorized(operation, affordance)
      }
      if (req.headers[this.headerName] != this.apikey) {
        return forbidden(operation, affordance)
      }
    }
}

module.exports = ApiKeyHeaderThingWrapper
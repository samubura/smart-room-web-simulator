
  exports.propertyNotFound = (id, propertyName) => {
    throw {
      code: 404,
      message: `Thing ${id} does not have property ${propertyName}`
    }
  }

  exports.actionNotFound = (id, actionName) => {
    throw {
      code: 404,
      message: `Thing ${id} does not have action ${actionName}`
    }
  }

  exports.unauthorized = (id, operation,affordanceName) => {
    throw {
      code: 401,
      message: `Authorization is required to ${operation} ${affordanceName} on thing ${id}`
    }
  }

  exports.forbidden = (id, operation,affordanceName) => {
    throw {
      code: 403,
      message: `Forbidden to ${operation} ${affordanceName} on thing ${id}`
    }
  }

  exports.badInput = (id, affordanceName) => {
    throw {
      code: 400,
      message: `Input for ${affordanceName} on thing ${id} was not correct`
    }
  }

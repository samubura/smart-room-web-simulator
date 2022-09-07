//const SerialMyCoBot = require("../../../../thing_models/proxy/SerialMyCoBot");
const MockMyCobot = require("../../../../thing_models/mock/MockMyCobot")
const exceptions = require("../../../../utils/thing-exceptions");
const ThingWrapper = require("../ThingWrapper");

class MyCobotWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, env, 0)

    this.thing = new MockMyCobot()//TODO change new SerialMyCoBot()
  }

  async mapProperty(req, propertyName) {
    switch (propertyName) {
      case "angles": return await this.thing.getAngles();
      case "coordinates":
        var array = await this.thing.getCoordinates(); 
        return {
          X: array[0],
          Y: array[1],
          Z: array[2],
          Rx: array[3],
          Ry: array[4],
          Rz: array [5]
        }
      case "headColor": return await this.thing.getHeadColor();
      case "gripper": return await this.thing.getGripper();
      default:
        this.propertyNotFound(propertyName)
    }
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case "writeAngles":
        if (!data
          || !data.jointAngles
          || data.jointAngles.length != 6
          || !data.jointAngles.every(a => (a > -160 && a < 160))
          || !data.speed
          || (data.speed < 0 || data.speed > 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        return await this.thing.writeAngles(data.jointAngles, data.speed);

      case "writeAngle":
        if (!data
          || !data.jointId
          || (data.jointId > 6 || data.jointId < 1)
          || !data.angle
          || (data.angle > 160 || data.angle < -160)
          || !data.speed
          || (data.speed < 0 || data.speed > 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        return await this.thing.writeAngle(data.jointId, data.angle, data.speed);

      case "reachCoordinates":
        if (!data
          || !data.coordinates
          || !["X","Y","Z","Rx","Ry","Rz"].every(k => Object.keys(data.coordinates).includes(k))
          || !["X", "Y", "Z"].every(k => data.coordinates[k] > -300 && data.coordinates[k] < 300)
          || !["Rx", "Ry", "Rz"].every(k => data.coordinates[k] > -180 && data.coordinates[k] < 180)
          || !data.speed
          || (data.speed < 0 || data.speed > 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        var coordArray = [data.coordinates.X, data.coordinates.Y, data.coordinates.Z, data.coordinates.Rx, data.coordinates.Ry, data.coordinates.Rz]
        return this.thing.reachCoordinates(coordArray, data.speed);

      case "reachCoordinate":
        if (!data
          || !data.coordinateId
          || !["X","Y","Z","Rx","Ry","Rz"].includes(data.coordinateId)
          || !data.value
          || (data.value<-300 || data.value > 300) 
          || !data.speed
          || (data.speed < 0 || data.speed > 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        return this.thing.reachCoordinate(data.coordinateId, data.value, data.speed);

      case "setColor":
        if (!data
          || !data.red
          || !data.green
          || !data.blue
          || !Object.values(data).every(c => (c > 0 && c < 255))){
          return exceptions.badInput(this.id, actionName)
        }
        return this.thing.setColor(data.red, data.green, data.blue);

      case "setGripper":
        if (!data
          || !data.value
          || (data.value < 0 || data.speed > 4096)
          || !data.speed
          || (data.speed < 0 || data.speed > 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        return this.thing.setGripper(data.value, data.speed);

      default:
        this.actionNotFound(actionName)
    }
  }

}

module.exports.create = (id, env) => new MyCobotWrapper(id, env)
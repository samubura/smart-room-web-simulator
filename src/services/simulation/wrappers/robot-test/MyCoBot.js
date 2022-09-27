const SerialMyCoBot = require("../../../../thing_models/proxy/SerialMyCoBot");
//const MockMyCobot = require("../../../../thing_models/mock/MockMyCobot")
const exceptions = require("../../../../utils/thing-exceptions");
const ThingWrapper = require("../ThingWrapper");

class MyCobotWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, env, 0)

    this.thing = new SerialMyCoBot()
  }

  async mapProperty(req, propertyName) {
    switch (propertyName) {
      case "angles": let angles = await this.thing.getAngles();
        return angles
      case "coordinates":
        let array = await this.thing.getCoordinates(); 
        return array;
      case "headColor": return await this.thing.getHeadColor();
      case "gripper": return await this.thing.getGripper();
      default:
        this.propertyNotFound(propertyName)
    }
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case "writeAngles":
        if ( Object.values(data.jointAngles).some(v => v < -160 || v > 160)
          || !data.speed
          || (data.speed < 0 || data.speed > 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        var jointArray = [
          data.jointAngles.J1,
          data.jointAngles.J2,
          data.jointAngles.J3,
          data.jointAngles.J4,
          data.jointAngles.J5,
          data.jointAngles.J6
        ]
        return await this.thing.writeAngles(jointArray, data.speed);

      case "writeAngle":
        if (!data
          || !data.jointId == undefined
          || (data.jointId > 6 || data.jointId < 1)
          || !data.angle == undefined
          || (data.angle > 160 || data.angle < -160)
          || !data.speed == undefined
          || (data.speed < 0 || data.speed > 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        return await this.thing.writeAngle(data.jointId, data.angle, data.speed);

      case "reachCoordinates":
        if (!data
          || !data.coordinates
          || !["X","Y","Z","Rx","Ry","Rz"].every(k => Object.keys(data.coordinates).includes(k))
          || !["X", "Y", "Z"].every(k => data.coordinates[k] >= -300 && data.coordinates[k] <= 300)
          || !["Rx", "Ry", "Rz"].every(k => data.coordinates[k] >= -180 && data.coordinates[k] <= 180)
          || !data.speed
          || (data.speed <= 0 || data.speed >= 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        var coordArray = [
          data.coordinates.X, 
          data.coordinates.Y, 
          data.coordinates.Z, 
          data.coordinates.Rx, 
          data.coordinates.Ry, 
          data.coordinates.Rz
        ]
        return this.thing.reachCoordinates(coordArray, data.speed);

      case "reachCoordinate":
        if (!data
          || !data.coordinateId
          || !["X","Y","Z","Rx","Ry","Rz"].includes(data.coordinateId)
          || !data.value
          || (data.value <= -300 || data.value >= 300) 
          || !data.speed
          || (data.speed <= 0 || data.speed >= 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        return this.thing.reachCoordinate(data.coordinateId, data.value, data.speed);

      case "setColor":
        if (
          !data
          || !isColorValid(data.red)
          || !isColorValid(data.green)
          || !isColorValid(data.blue)
          ){
          return exceptions.badInput(this.id, actionName)
        }
        return this.thing.setColor(data.red, data.green, data.blue);

      case "setGripper":
        if (!data
          || (data.value < 0 || data.value > 100)
          || (data.speed < 0 || data.speed > 100)) {
          return exceptions.badInput(this.id, actionName)
        }
        return this.thing.setGripper(data.value, data.speed);

      default:
        this.actionNotFound(actionName)
    }
  }

}


function isColorValid(color){
  return color >= 0 && color <=255
}

module.exports.create = (id, env) => new MyCobotWrapper(id, env)
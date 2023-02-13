const SerialMyCoBot = require("../../../../thing_models/proxy/SerialMyCoBot");
const exceptions = require("../../../../utils/thing-exceptions");
const ThingWrapper = require("../ThingWrapper");

const defaultSpeed = 30

class RobotArmWrapper extends ThingWrapper {

  constructor(id, env) {
    super(id, env, 0)

    this.thing = new SerialMyCoBot()
  }

  async mapProperty(req, propertyName) {
    switch (propertyName) {
      default:
        this.propertyNotFound(propertyName)
    }
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case "goSphere":
        var jointArray = [ 60, -80, 72, -92, -69, -45 ]
        await this.thing.writeAngles(jointArray, defaultSpeed);
        return;
      case "goTall":
        var jointArray = [ -30, 50, -40, -10, -140, -125 ]
        await this.thing.writeAngles(jointArray, defaultSpeed); 
        return; 
      case "goMiddle": 
        var jointArray = [ 0, 0, 0, 0, -90, -45]
        await this.thing.writeAngles(jointArray, defaultSpeed);
        return;
      case "writeAngles":
        if (
          Object.values(data.jointAngles).some(v => !isAngleValid(v))
          || isSpeedValid(data.speed)
        ) {
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
        await this.thing.writeAngles(jointArray, data.speed);
        return 

      case "writeAngle":
        if (!data
          || isJointValid(data.jointId)
          || !isAngleValid(data.angle)
          || !isSpeedValid(data.speed)) {
          return exceptions.badInput(this.id, actionName)
        }
        await this.thing.writeAngle(data.jointId, data.angle, data.speed);
        return 

      case "setColor":
        if (!data.color){
          return exceptions.badInput(this.id, actionName)
        }
        var color = hexToRgb(data.color)
        await this.thing.setColor(color[0], color[1], color[2]);
        return 

      case "setGripper":
        if (!data
          || !isGripperValid(data.value)
          || !isSpeedValid(data.speed)
        ){
          return exceptions.badInput(this.id, actionName)
        }
        await this.thing.setGripper(data.value, data.speed);
        return 

      default:
        this.actionNotFound(actionName)
    }
  }

}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

function isJointValid(jointId){
  return jointId != undefined && jointId >=1 && jointId <= 6
}

function isAngleValid(angle){
  return  angle >= -160 && angle <= 160
}

function isGripperValid(gripper){
  return gripper != undefined && gripper >= 0 && gripper <= 100
}

function isSpeedValid(speed){
  return  speed >= 0 && speed <= 100
}

function isColorValid(color){
  return color != undefined && color >= 0 && color <=255
}

module.exports.create = (id, env) => new RobotArmWrapper(id, env)
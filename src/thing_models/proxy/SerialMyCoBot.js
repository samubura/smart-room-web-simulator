const ThingInterface = require("../ThingInterface");

const mycobot = require("mycobot")
// obj Based on SerialPort 
const serial = mycobot.connect("COM3",115200) //TODO change?

//extracted from mycobot commons
const Coord = {
    X: 1,
    Y: 2,
    Z: 3,
    Rx: 4,
    Ry: 5,
    Rz: 6,
  }

class SerialMyCoBot extends ThingInterface {

  currentColor = {
    red: 0,
    green: 255,
    blue: 0
  }
  constructor(){
    super()
    //setting starting color equivalent to the one in memory
    serial.write(mycobot.setColor(this.currentColor.red, this.currentColor.green, this.currentColor.blue))
  }

  getAngles() {
    return serial.write(mycobot.getAngles())
  }

  getCoordinates(){
    return serial.write(mycobot.getCoords())
  }

  getHeadColor(){
    return this.currentColor
  }

  getGripper(){
    return serial.write(mycobot.getGripperValue())
  }

  writeAngles(angles, speed){
    serial.write(mycobot.sendAngles(angles, speed))
  }

  writeAngle(jointId, angle, speed){
    serial.write(mycobot.sendAngle(jointId, angle, speed))
  }

  reachCoordinates(coordinates, speed){
    serial.write(mycobot.sendCoords(coordinates, speed, 1)) //mode is hardcoded to linear
  }

  reachCoordinate(coordinateId, value, speed){
    serial.write(mycobot.sendCoord(Coord[coordinateId], value, speed))
  }

  setColor(red, green, blue){
    this.currentColor = {
        red, 
        green,
        blue
    }
    serial.write(mycobot.setColor(red, green, blue))
  }

  setGripper(value, speed){
    serial.write(mycobot.setGripperValue(value, speed))
  }

}

module.exports = SerialMyCoBot
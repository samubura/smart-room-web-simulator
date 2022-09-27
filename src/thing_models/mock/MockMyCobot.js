const ThingInterface = require("../ThingInterface");

//extracted from mycobot commons
const Coord = {
    X: 1,
    Y: 2,
    Z: 3,
    Rx: 4,
    Ry: 5,
    Rz: 6,
  }

class MockMyCoBot extends ThingInterface {

  currentAngles = [0,0,0,0,0,0]
  currentCoord = [0,0,0,0,0,0]
  currentGripper = 2048
  currentColor = {
    red: 0,
    green: 255,
    blue: 0
  }
  constructor(){
    super()
    //setting starting color equivalent to the one in memory
    
  }

  getAngles() {
    return this.currentAngles
  }

  getCoordinates(){
    return this.currentCoord
  }

  getHeadColor(){
    return this.currentColor
  }

  getGripper(){
    return this.currentGripper
  }

  writeAngles(angles, speed){
    this.currentAngles = angles
  }

  writeAngle(jointId, angle, speed){
    this.currentAngles[jointId] = angle
  }

  reachCoordinates(coordinates, speed){
    this.currentCoord = coordinates
  }

  reachCoordinate(coordinateId, value, speed){
    this.currentCoord[Coord[coordinateId]-1] = value
  }

  setColor(red, green, blue){
    this.currentColor = {
        red, 
        green,
        blue
    }
  }

  setGripper(value, speed){
    this.currentGripper = value
  }

}

module.exports = MockMyCoBot
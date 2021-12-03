const ThingWrapper = require("../ThingWrapper");
const exceptions = require('../../../../utils/thing-exceptions')
const axios = require('axios')

//direction is 
//0 positive y 
//1 positive x 
//2 negative y
//3 negative x

class Tractor extends ThingWrapper {

  position
  homePosition
  direction
  ip = "";

  constructor(id, ticksFromLastEvent, actionEvent, ip, startingPosition, startingDirection) {
    super(id, ticksFromLastEvent, actionEvent)
    this.ip = ip
    this.homePosition = startingPosition
    this.position = startingPosition
    this.direction = startingDirection
  }

  async mapProperty(req, propertyName) {
    switch(propertyName) {
      case 'position':
        return this.position
      case 'direction':
        return this.direction
      default:
        exceptions.propertyNotFound(this.id, propertyName)
    }
  }

  async mapAction(req, actionName, data) {
    switch (actionName) {
      case 'moveToField':
        if(typeof data == "object" && Object.keys(data).length === 0){
          exceptions.badInput(this.id, "moveTo")
        }
        if(data==null || data < 0 || data > 8){
          exceptions.badInput(this.id, "moveTo")
        }
        return this.move(this.position, data)
      case 'goHome':
        return this.move(this.position, this.homePosition)
      default:
        exceptions.actionNotFound(this.id, actionName)
    }
  }

  _getForwardSteps(n){
    var steps = []
    for (let i = 0; i < n; i++) {
      steps.push({axis:0, speed: 2, duration: 1900})
    }
    return steps;
  }

  _getTurnStep(turn){
    //return {axis:2, speed: 1*turn, duration: 2120}
    return {axis:2, speed: 2*turn, duration: 745}
  }

  _updateDirection(turn){
    this.direction = this.direction + turn
    if(this.direction > 3){
      this.direction = 0;
    }
    if(this.direction < 0){
      this.direction = 3
    }
  }

  move(start, stop){
    if(stop == 3){
      stop = 5
    } else if(stop == 5){
      stop = 3
    }
    let x = stop%3 - start%3
    let y = Math.floor(stop/3) - Math.floor(start/3)
    let steps = []
    switch(this.direction){
      case 0: case 2:
        if(y!= 0){
          if(Math.sign(y) != Math.sign(1-this.direction)){
            steps.push(this._getTurnStep(1))
            this._updateDirection(1)
            steps.push(this._getTurnStep(1))
            this._updateDirection(1)
          }
          steps = steps.concat(this._getForwardSteps(Math.abs(y)))
        }
        if(x != 0){
          var sign = this.direction == 0 ? 1 : -1
          steps.push(this._getTurnStep(Math.sign(x*sign)))
          this._updateDirection(Math.sign(x*sign))
        }
        steps = steps.concat(this._getForwardSteps(Math.abs(x)))
        break;
      case 1: case 3:
        if(x!= 0){
          if( Math.sign(x) != Math.sign(2-this.direction)){
            steps.push(this._getTurnStep(1))
            this._updateDirection(1)
            steps.push(this._getTurnStep(1))
            this._updateDirection(1)

          }
          steps = steps.concat(this._getForwardSteps(Math.abs(x)))
        }
        if(y != 0){
          var sign = this.direction == 1 ? -1 : 11
          steps.push(this._getTurnStep(Math.sign(y*sign)))
          this._updateDirection(Math.sign(y*sign))
        }
        steps = steps.concat(this._getForwardSteps(Math.abs(y)))
        break;
      
      default: break;
    }
    this.executeSteps(steps);
    if(steps.length){
      this.position = stop;
      let time = steps.map(x => x.duration).reduce((x,y) => x+y)/1000
      return time+1.5
    } else {
      return 0;
    }
  }

  async executeSteps(steps){
    var url = `${this.ip}/actions/wheelcontrol`
    for (const step of steps) {
      await axios.post(url, step)
      await new Promise(r => setTimeout(r, step.duration));
    }
  }
}

module.exports = Tractor;
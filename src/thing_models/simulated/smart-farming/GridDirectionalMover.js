//direction is 
//0 positive y 
//1 positive x 
//2 negative y
//3 negative x

const SituatedThing = require("../../SituatedThing");

class GridDirectionalMover extends SituatedThing{

  position = {x: undefined, y: undefined};
  homePosition = {x: undefined, y: undefined};
  direction = undefined;

  boundaries = {
    xMax: undefined,
    xMin: undefined,
    yMax: undefined,
    yMin: undefined,
  }

  stepStack = [];
  currentStep = undefined;

  constructor(environment, startingPosition, startingDirection) {
    super(environment)
    this.homePosition = startingPosition
    this.position = startingPosition
    this.direction = startingDirection
    this.boundaries = environment.getBoundaries();
  }

  getPosition() {
    return this.position
  }

  getDirection() {
    return this.direction
  }

  getHomePosition() {
    return this.homePosition
  }

  move(newPosition){
    console.log(newPosition)
    if(!this._admissiblePosition(newPosition)){
      return -1;
    }
    //create a copy of the direction to plan
    let mental_direction = this.direction
    let x = newPosition.x - this.position.x
    let y = newPosition.y - this.position.y
    let steps = []
    switch(mental_direction){
      case 0: case 2:
        if(y!= 0){
          if(Math.sign(y) != Math.sign(1-mental_direction)){
            steps.push(this._getTurnStep(1))
            mental_direction = this._getUpdatedMentalDirection(mental_direction, 1)
            steps.push(this._getTurnStep(1))
            mental_direction = this._getUpdatedMentalDirection(mental_direction, 1)
          }
          steps = steps.concat(this._getForwardSteps(Math.abs(y)))
        }
        if(x != 0){
          var sign = mental_direction == 0 ? 1 : -1
          steps.push(this._getTurnStep(Math.sign(x*sign)))
          mental_direction = this._getUpdatedMentalDirection(mental_direction, Math.sign(x*sign))
        }
        steps = steps.concat(this._getForwardSteps(Math.abs(x)))
        break;
      case 1: case 3:
        if(x!= 0){
          if( Math.sign(x) != Math.sign(2-mental_direction)){
            steps.push(this._getTurnStep(1))
            mental_direction = this._getUpdatedMentalDirection(mental_direction, 1)
            steps.push(this._getTurnStep(1))
            mental_direction = this._getUpdatedMentalDirection(mental_direction, 1)
          }
          steps = steps.concat(this._getForwardSteps(Math.abs(x)))
        }
        if(y != 0){
          var sign = mental_direction == 1 ? -1 : 11
          steps.push(this._getTurnStep(Math.sign(y*sign)))
          mental_direction = this._getUpdatedMentalDirection(mental_direction, Math.sign(y*sign))
        }
        steps = steps.concat(this._getForwardSteps(Math.abs(y)))
        break;
      
      default: break;
    }
    this.stepStack = steps.reverse()
    return steps.map(x => x.ticks).reduce((x,y) => x+y)
  }

  tick(){
    if(this.currentStep){
      if(this.currentStep.ticks == 0){
        this._executeCurrentStep();
        return
      } else {
        this.currentStep.ticks = this.currentStep.ticks - 1
        return
      }
    }
    if(!this.currentStep && this.stepStack.length > 0){
      this.currentStep = this.stepStack.pop();
      if(this.currentStep.ticks - 1 > 0){
        this.currentStep.ticks = this.currentStep.ticks - 2
        return;
      } else {
        this._executeCurrentStep();
      }
    }
  }

  _executeCurrentStep(){
    if(this.currentStep.turn){
      this._turn(this.currentStep.direction);
    } else {
      this._stepForward();
    }
    this.currentStep = undefined;
  }

  _admissiblePosition(position){
    return position.x >= this.boundaries.xMin && position.x <= this.boundaries.xMax && position.y >= this.boundaries.yMin && position.y <= this.boundaries.yMax
  }

  _getForwardSteps(n){
    var steps = []
    for (let i = 0; i < n; i++) {
      steps.push({direction: 0, turn: false, ticks: 3})
    }
    return steps;
  }

  _getTurnStep(turnDirection){
    return {direction: turnDirection, turn: true, ticks: 1}
  }

  _getUpdatedMentalDirection(mental_direction, turnDirection){
    mental_direction = mental_direction + turnDirection
    if(mental_direction > 3){
      mental_direction = 0;
    }
    if(mental_direction < 0){
      mental_direction = 3
    }
    return mental_direction
  }

  _turn(turnDirection){
    this.direction = this.direction + turnDirection
    if(this.direction > 3){
      this.direction = 0;
    }
    if(this.direction < 0){
      this.direction = 3
    }
  }

  _stepForward() {
    switch(this.direction){
      case 0: this.position.y = this.position.y + 1; break;
      case 1: this.position.x = this.position.x + 1; break;
      case 2: this.position.y = this.position.y - 1; break;
      case 3: this.position.x = this.position.x - 1; break;
    }
    
  }
}

module.exports = GridDirectionalMover;
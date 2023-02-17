const GridDirectionalMover = require("./GridDirectionalMover");

const irrigatingSpeed = 2;

class IrrigatorTractor extends GridDirectionalMover {
  
  waterLevel = 0;
  mentalWaterLevel = 0;
  maxWaterLevel = 0;

  constructor(env, startingPosition, startingDirection, waterLevel){
    super(env, startingPosition, startingDirection)
    this.maxWaterLevel = waterLevel
    this.waterLevel = waterLevel
    this.mentalWaterLevel = waterLevel
  }

  getWaterLevel(){
    return this.waterLevel;
  }

  refillWater(){
    this.waterLevel = this.maxWaterLevel
    this.mentalWaterLevel = this.waterLevel
  }

  irrigate(){
    if(this.mentalWaterLevel >= 1){
      this.actionStack.push({action:"irrigate", ticks:irrigatingSpeed})
      this.mentalWaterLevel = this.mentalWaterLevel - 1;
    }
    return irrigatingSpeed;
  }

  _executeCurrentAction(){
    if(this.currentAction.action == "irrigate"){
        this.environment.irrigate(this.position);
        this.waterLevel = this.waterLevel - 1;
    } else {
        super._executeCurrentAction();
    }
  }
}

module.exports = IrrigatorTractor;
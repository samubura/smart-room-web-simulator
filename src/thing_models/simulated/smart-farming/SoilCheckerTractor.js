const GridDirectionalMover = require("./GridDirectionalMover");

const soilCheckingSpeed = 0;

class SoilCheckerTractor extends GridDirectionalMover {
  
  constructor(env, startingPosition, startingDirection){
      super(env, startingPosition, startingDirection)
  }

  getSoilHumidity(){
    return this.environment.getHumidity(this.getPosition())
  }
}

module.exports = SoilCheckerTractor;
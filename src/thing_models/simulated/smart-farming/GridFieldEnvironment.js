const GridEnvironment = require("./GridEnvironment");

const tickMultiplier = 2.5;

class GridFieldEnvironment extends GridEnvironment{

  field = [];
  maxHumidity = 2;
  minHumidity = 0;  
  decayTicks = 0;

  xSize = undefined
  ySize = undefined

  constructor(boundaries) {
    super(boundaries)
    this.xSize = this.boundaries.xMax + 1 - this.boundaries.xMin
    this.ySize = this.boundaries.yMax + 1 - this.boundaries.yMin
    //tune this formula...
    this.decayTicks = Math.round(tickMultiplier * this.xSize * this.ySize);
    this._initField();
  }

  getField(){
    return this.field;
  }

  _initField(){
    this.field = Array(this.xSize).fill().map(()=>Array(this.ySize).fill().map(() => Math.floor(Math.random()*(this.maxHumidity+1))))
    this.actionStack.push({action: "decay", ticks: this.decayTicks})
  }

  _decay(){
    let decayMatrix = Array(this.xSize).fill().map(()=>Array(this.ySize).fill().map(() => Math.round(Math.random())))
    for (let i = 0; i < decayMatrix.length; i++) {
      for (let j = 0; j < decayMatrix[i].length; j++) {
        if(this.field[i][j] > 0){
          this.field[i][j] = this.field[i][j]-decayMatrix[i][j];
        }
      }
    }
    this.actionStack.push({action: "decay", ticks: this.decayTicks})
  }

  rain(){
    for (let x = 0; x < this.field.length; x++) {
      for (let y = 0; y < this.field[x].length; y++) {
        this.irrigate({x,y})
      }
    }
  }

  dryAll(){
    for (let x = 0; x < this.field.length; x++) {
      for (let y = 0; y < this.field[x].length; y++) {
        this.dry({x,y})
      }
    }
  }

  irrigate(position){
    this.field[position.x-this.boundaries.xMin][position.y-this.boundaries.yMin] = this.maxHumidity;
  }

  dry(position){
    this.field[position.x-this.boundaries.xMin][position.y-this.boundaries.yMin] = this.minHumidity;
  }

  getHumidity(position){
    return this.field[position.x-this.boundaries.xMin][position.y-this.boundaries.yMin]
  }

  _executeCurrentAction(){
    this._decay();
  }
}

module.exports = GridFieldEnvironment;
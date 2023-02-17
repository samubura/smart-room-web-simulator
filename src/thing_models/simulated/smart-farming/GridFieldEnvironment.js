//direction is 
//0 positive y 
//1 positive x 
//2 negative y
//3 negative x

const boundaries = {
  xMax: 4,
  xMin: 0,
  yMax: 4,
  yMin: 0,
}

const GridEnvironment = require("./GridEnvironment");

class GridFieldEnvironment extends GridEnvironment{

  field = [];
  maxHumidity = 2;
  minHumidity = 0;  
  decayTicks = 10;

  xSize = undefined
  ySize = undefined

  constructor() {
    super(boundaries)
    this.xSize = this.boundaries.xMax + 1 - this.boundaries.xMin
    this.ySize = this.boundaries.yMax + 1 - this.boundaries.yMin
    this._initField();
  }

  _initField(){
    this.field = Array(this.xSize).fill().map(()=>Array(this.ySize).fill().map(() => Math.floor(Math.random()*(this.maxHumidity+1))))
    this.actionStack.push({action: "decay", ticks: this.decayTicks})
    console.log(this.field)
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
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        this.irrigate(i,j)
      }
    }
  }

  irrigate(x,y){
    this.field[x-this.boundaries.xMin][y-this.boundaries.yMin] = this.maxHumidity;
    console.log(this.field)
  }

  _executeCurrentAction(){
    this._decay();
  }
}

module.exports = GridFieldEnvironment;
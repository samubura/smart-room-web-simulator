const ThingInterface = require("./ThingInterface");

class Lamp extends ThingInterface {
  
  status;
  color;

  constructor(){
    super()
    this.color = '#ffffcc';
    this.status = false;
  }

  getStatus(){
    return this.status
  }

  getColor(){
    return this.color
  }

  toggle(){
    this.status = !this.status;
  }

  setColor(color){
    this.color = color;
  }
}

module.exports = Lamp
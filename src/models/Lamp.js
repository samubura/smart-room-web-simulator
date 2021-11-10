const ThingInterface = require("./ThingInterface");

class Lamp extends ThingInterface {
  
  status;
  color;
  id

  constructor(id){
    super(id)
    this.color = '#ffffcc';
    this.status = false;
    this.id = id;
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
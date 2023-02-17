componentFactory.GridDirectionalMover = {
  create: async (td) => {
    var thing = new GridDirectionalMover(td)
    return thing
  }
}

class GridDirectionalMover extends ThingComponentInterface{

  lastPosition = undefined;
  lastDirection = undefined;
  $indicator = undefined;

  constructor(td) {
    super(td)
    this._createDOM()
  }

  update(state){

    let x = state.position.x
    let y = state.position.y

    let degree = 90*state.direction

    if(this.lastPosition == undefined || x != this.lastPosition.x || y != this.lastPosition.y || state.direction != this.lastDirection){
      this.$indicator.remove()
      this.$indicator = $(`<img id="${this.td.title}" 
      style="transform:rotate(${degree}deg);"
      src="./components/GridDirectionalMover/${this.td.title}.png" class="grid-image">`);

      $(`#${x}_${y}`).append(this.$indicator)
      this.lastPosition = {x,y}
      this.lastDirection = state.direction
    }
    
  }

  _createDOM() {
    this.$indicator = $(`<img id="${this.td.title}" 
    style="transform:rotate(${0}deg);"
    src="./components/GridDirectionalMover/${this.td.title}.png" class="grid-image">`);
  }

}
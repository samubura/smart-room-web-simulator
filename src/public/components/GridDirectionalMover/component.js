componentFactory.GridDirectionalMover = {
  create: async (td) => {
    var thing = new GridDirectionalMover(td)
    return thing
  }
}

class GridDirectionalMover extends ThingComponentInterface{

  lastPosition = undefined;

  constructor(td) {
    super(td)
    this._createDOM()
  }

  //NB! in order for this to work the properties in the model and in the TD must have the same name
  update(state){
    if(this.lastPosition){
      $(`#${this.lastPosition.x}_${this.lastPosition.y}`).empty();
    }

    let x = state.position.x
    let y = state.position.y

    let degree = 90*state.direction

    $(`#${x}_${y}`).append(`<img id="${this.td.title}" 
    style="transform:rotate(${degree}deg);"
    src="./components/GridDirectionalMover/${this.td.title}.png" class="grid-image">`)

    this.lastPosition = {x, y}
  }

  _createDOM() {
    
  }

}
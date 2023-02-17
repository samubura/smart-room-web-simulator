componentFactory.GridFieldEnvironment = {
  create: async (td) => {
    var thing = new GridField(td)
    return thing
  }
}

class GridField extends ThingComponentInterface{

  $gridDiv = undefined

  constructor(td) {
    super(td)
    this._createDOM()
  }

  update(state){
    let xSize = state.boundaries.xMax +1 - state.boundaries.xMin
    let ySize = state.boundaries.yMax +1 - state.boundaries.yMin

    if(this.$gridDiv.children().length == 0){
      let height = (100/ySize)+"%"
      let width = (100/xSize)+"%";
      for (let i = state.boundaries.yMin; i <= state.boundaries.yMax; i++) {
        for (let j = state.boundaries.xMin; j <= state.boundaries.xMax; j++) {
          $(`<div id="${j+'_'+i}" class="cell" style="width: ${width};height:${height};">`).prependTo(this.$gridDiv)
        }
      }
    } else {
      for (let y = state.boundaries.yMin; y <= state.boundaries.yMax; y++) {
        for (let x = state.boundaries.xMin; x <= state.boundaries.xMax; x++) {
          console.log(x+" "+y);
          let i = x - state.boundaries.xMin
          let j = y - state.boundaries.yMin
          $(`#${x+'_'+y}`).removeClass(["cell-humid", "cell-regular", "cell-dry"])
          switch(state.field[i][j]){
            case 0: $(`#${x+'_'+y}`).addClass("cell-dry"); break;
            case 1: $(`#${x+'_'+y}`).addClass("cell-regular"); break;
            case 2: $(`#${x+'_'+y}`).addClass("cell-humid"); break;
            default: break;
          }
        }
      }
    }
  }

  _createDOM() {
    this.$gridDiv = $(`<div id="${this.td.title}" class="grid">`).appendTo($things)
  }

}
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

  //NB! in order for this to work the properties in the model and in the TD must have the same name
  update(state){
    this.$gridDiv.empty();
    let x = state.boundaries.xMax
    let y = state.boundaries.yMax
    let height = (100/y)+"%"
    let width = (100/x)+"%";
    for (let i = 0; i < y; i++) {
      for (let j = 0; j < x; j++) {
        $(`<div id="${j+'_'+i}" class="cell" style="width: ${width};height:${height};">`).prependTo(this.$gridDiv)
      }
    }
  }

  _createDOM() {
    this.$gridDiv = $(`<div id="${this.td.title}" class="grid">`).appendTo($things)
  }

}
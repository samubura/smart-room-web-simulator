componentFactory.BasicThing = {
  create: async (td) => {
    var thing = new BasicThing(td)
    return thing
  }
}

class BasicThing extends ThingComponentInterface{

  $propElem = undefined
  $actionRow = undefined

  constructor(td) {
    super(td)
    this._createDOM()
  }

  //NB! in order for this to work the properties in the model and in the TD must have the same name
  update(state){
    var text = this._prettyJSON(state)
    this.$propElem.text(text)
  }

  _prettyJSON(state){
    var text = JSON.stringify(state, null, 2)
    return text
  }


  _createDOM() {
    //use this function to render the component and add all of it's behaviour
    var $thingDiv = $(`<div id="${this.td.title}" class="row thing-row">`).appendTo($things)

    $thingDiv.append(`<div class="row thing-name-row">${this.td['@type']}: ${this.td.title}</div>`)
    //properties fields
    var $affordanceRow = $(`<div class="row affordance-row"></div>`).appendTo($thingDiv)
    var $propCol = $(`<div class="col-5"></div>`).appendTo($affordanceRow)
    var $actionCol = $(`<div class="col-7"></div>`).appendTo($affordanceRow)
    this.$actionRow = $(`<div class="row"></div>`).appendTo($actionCol)

    this.$propElem = $('<pre>').appendTo($propCol)
    var state = {}

    for (var p in this.td.properties) {
      state[p] = null;
    }
    this.update(state)
/*
    for (var a in this.td.actions) {
      this.$actionRow.append(`
        <button class="btn btn-secondary">${a}</button>
      `)
    }
    */
  }

}
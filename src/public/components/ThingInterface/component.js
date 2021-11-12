componentFactory.ThingInterface = {
  create: async (td) => {
    var thing = new ThingInterface(td)
    await thing.load()
    return thing
  }
}

class ThingInterface {

  td = undefined

  constructor(td) {
    this.td = td;
    this._createDOM();
  }

  async load() {
    for (var p in this.td.properties) {
      var res = await client.get(this.td.base + this.td.properties[p].forms[0].href)
      var value = (JSON.stringify(res.data))
      //update fields on the template
      $(`#${this.td.title}-${p}`).parent().find('span').text(value)
    }
  }


  //NB! in order for this to work the properties in the model and in the TD must have the same name (but that's ok to me)
  update(state){
    //update property fields based on the state from the simulation model
    for(var p in state){
      var value = state[p]
      $(`#${this.td.title}-${p}`).parent().find('span').text(value)
    }
  }


  _createDOM() {
    console.log("Rendering " + this.td.title)
    //use this function to render the component and add all of it's behaviour
    var $thingDiv = $(`<div id="${this.td.title}" class="row thing-row">`).appendTo($things)

    $thingDiv.append(`<div class="row thing-name-row">${this.td['@type']}: ${this.td.title}</div>`)
    //properties fields
    var $affordanceRow = $(`<div class="row affordance-row"></div>`).appendTo($thingDiv)
    var $propCol = $(`<div class="col"></div>`).appendTo($affordanceRow)
    var $actionCol = $(`<div class="col"></div>`).appendTo($affordanceRow)

    for (var p in this.td.properties) {
      $propCol.append(`
        <div>
          <label id="${this.td.title}-${p}">${p}:</label>
          <span></span>
        </div>
      `)
    }

    for (var a in this.td.actions) {
      $actionCol.append(`
        <div>
          <button>${a}</button>
        </div>
      `)
    }
  }

}
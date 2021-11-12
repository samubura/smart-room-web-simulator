componentFactory.Lamp = {
  create: async (td) => {
    var thing = new Lamp(td)
    await thing.load()
    return thing
  }
}

class Lamp extends ThingComponentInterface {

  constructor(td){
    super(td)
    this._createDOM();
  }

  update(state){
    if(state.state){
      $(`#${this.td.title}`).find('img').css("background-color", state.color)
    } else {
      $(`#${this.td.title}`).find('img').css("background-color", "transparent")
    }
    
    var stateText = state.state ? " on": " off"

    $(`#${this.td.title}-state`).text(stateText)
  }

  _createDOM(){
    var $thingDiv = $(`<div id="${this.td.title}" class="row lamp-row">`).appendTo($things)
    $(`<div class="col">
    <p>${this.td['@type']}: ${this.td.title}</p>
    <label>State:</label><span id="${this.td.title}-state"></span>
    </div>`).appendTo($thingDiv)
    var $imgDiv = $('<div class="lamp-img col">').appendTo($thingDiv)
    $(`<img src="./components/Lamp/lamp.png" alt="lamp icon"> `).appendTo($imgDiv)
  }



}
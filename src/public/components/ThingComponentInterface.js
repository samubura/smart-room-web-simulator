class ThingComponentInterface {
  td = undefined;

  constructor(td){
    this.td = td
  }
  
  async load() {
    var state = {}
    for (var p in this.td.properties) {
      var res = await client.get(this.td.base + this.td.properties[p].forms[0].href)
      var value = res.data
      state[p] = value
    }
    this.update(state)
  }

  update(state){}

  _createDOM(){}
}
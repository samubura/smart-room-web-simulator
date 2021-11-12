class UpdateManager {

  socket = undefined;
  components = []

  constructor(socket, components){
    this.socket = socket
    this.components = components
  }

  startListening(){
    this.socket.on("thing-update", e => this._handleThingEvent(e));
  }

  _handleThingEvent(event){
    this.components[event.id].update(event.state)
  }
}
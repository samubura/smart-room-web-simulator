class LogManager {

  socket = undefined;
  $textarea = undefined
  count = 0;

  constructor(socket){
    this.socket = socket
    this.$textarea = $('#logs>textarea')
  }

  startListening(){
    this.socket.on("thing-update", e => this._handleThingEvent(e));
    this.socket.on("agent-interaction", e => this._handleAgentEvent(e))
  }

  _handleThingEvent(event){
    var message = `${event.id}: ${JSON.stringify(event.state)}`
    this._logMessage(message)
  }

  _handleAgentEvent(event){
    var message = "";
    if(event.agentId == 'web-ui') return;

    if(event.agentId){
      message = `Agent ${event.agentId} ${event.type} ${event.affordance} of ${event.thingId}`
    } else {
      message = `Unidentified agent ${event.type} ${event.affordance} of ${event.thingId}`
    }
    this._logMessage(message)
  }

  _logMessage(message){
    let erase = false
    if(this.count > 200){
      this.count = 0
      erase = true
    } else {
      this.count = this.count+1;
    }
    var timeStamp = new Date().toLocaleTimeString('en-IT', { hour12: false })
    var eventString = `[${timeStamp}] ${message}`
    $('#logs').find('textarea').val(function(i, text) {
      if(erase){
        text = "";
      }
      return text + eventString + '\n';
    });
    this._scrollToBottom();
  }

  _scrollToBottom(){
    this.$textarea.scrollTop(this.$textarea[0].scrollHeight);
  }

}
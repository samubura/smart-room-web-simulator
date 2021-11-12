class LogManager {

  socket = undefined;
  $textarea = undefined

  constructor(socket){
    this.socket = socket
    this.$textarea = $('#logs>textarea')
  }

  startListening(){
    this.socket.on("thing-update", e => this._handleThingEvent(e));
  }

  _handleThingEvent(event){
    var timeStamp = new Date().toLocaleTimeString('en-IT', { hour12: false })
    var eventString = `[${timeStamp}] ${event.id}: ${JSON.stringify(event.state)}`
    $('#logs').find('textarea').val(function(i, text) {
      return text + '\n'+ eventString;
    });
    this._scrollToBottom();
  }

  _scrollToBottom(){
    this.$textarea.scrollTop(this.$textarea[0].scrollHeight);
  }

}
const simulation = require('./simulation')

let io = undefined

exports.publish = function (eventName, body) {
  if(io){
    io.emit(eventName, body)
  }
}

exports.onConnection = function (socket) {
  io = socket;
}
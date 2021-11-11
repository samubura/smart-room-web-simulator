let io = undefined

exports.publish = function (eventName, body) {
  io.emit(eventName, body)
}

exports.onConnection = function (socket) {
  io = socket;
}
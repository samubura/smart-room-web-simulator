const express = require('express');
const bodyParser = require('body-parser');

const eventService = require('./services/event-service')
const simulation = require('./services/simulation')

const { workspace } = require('../config')
const { notFound } = require('./utils/action-results')


exports.startServer = async function (port) {
  const app = express()
  const server = require('http').createServer(app)
  
  simulation.start(workspace);

  const io = require('socket.io')(server)
  io.on('connection', function (socket) {
    console.log('Socket open')
    eventService.onConnection(socket)
  })

  //bodyparser
  var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }
  app.use(bodyParser.json({
    verify: rawBodySaver
  }));
  app.use(bodyParser.urlencoded({
    verify: rawBodySaver,
    extended: true
  }));
  app.use(bodyParser.raw({
    verify: rawBodySaver,
    type: '*/*'
  }));

  //middleware for setting response result
  app.use(function (_, res, next) {
    res.setResult = function (result) {
      result(this)
    }
    next()
  })

  //serve the front-end app
  app.use(express.static('public'))

  //routes
  require('./routes')(app)

  //notFound
  app.use(function (req, res) {
    res.setResult(notFound(`${req.originalUrl} not found`))
  })

  //start listening
  server.listen(port, function () {
    console.log(`Started on port ${port}!`)
  })
}

this.startServer(3000)
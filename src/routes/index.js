module.exports = function (app) {
  require('./thing-descriptions')(app)
  require('./thing-affordances')(app)
  require('./simulation-update')(app)
}
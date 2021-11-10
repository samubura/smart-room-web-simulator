module.exports = function(app) {
  require('./thing-descriptions')(app)
  require('./lamp-thing')(app)
}
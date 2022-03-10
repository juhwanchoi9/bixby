var console = require('console')
var dates = require('dates')
var config = require('config')

module.exports.function = function voteDday() {

  var now = new Date()
  var sgId = '20210407'
  var year = sgId.substr(0, 4)
  var month = sgId.substr(4, 2)-1
  var day = sgId.substr(6, 2)
  var Dday = new Date(year, month, day,0,0,0,0)

  var gap = now.getTime() - Dday.getTime()
  var result = Math.floor(gap / (1000 * 60 * 60 * 24)) * -1

  return result
}
var console = require('console')

module.exports.function = function mapPunchOut(point, addr) {

  //ex) geo:37.554998,126.970577?q=서울역
  var result = "geo:" + point.latitude + "," + point.longitude + "?q=" + addr

  return result;
}
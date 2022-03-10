var console = require('console')
var http = require("http")
var fail = require('fail')


module.exports.function = function findLocation(addr, evPs, near, locationAddr, point) {
  console.log(point)

  var point = {
    latitude: point.point.latitude,
    longitude: point.point.longitude,
  }

  return {
    point: point,
    locationResult: {
      addr: locationAddr.addr, //투표소 주소
      location: locationAddr.location, //투표소 이름
      wiwName: addr, //사용자발화
      evPs: evPs,
      placeName: locationAddr.placeName,
      floor: locationAddr.floor
    }
  }
}
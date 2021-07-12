var console = require('console')
var http = require("http")
var fail = require('fail')

module.exports.function = function findPoint(addr, evPs, near, countryDivision) {
  const KEY = secret.get('key')
  const BaseUrl1 = 'http://apis.data.go.kr/9760000/PolplcInfoInqireService2/getPrePolplcOtlnmapTrnsportInfoInqire?serviceKey='
  //사전
  const BaseUrl2 = 'http://apis.data.go.kr/9760000/PolplcInfoInqireService2/getPolplcOtlnmapTrnsportInfoInqire?serviceKey='
  //선거일
  const ServiceKey = 'k6b%2BV7YJOhFvkSxbt8v30o4w7TS%2BHKnjtg0xhbmnA6reKklNmILinrm18QU7kkXqo49LLAdXUMA8kCCrO2VAXw%3D%3D'
  const PageNo = 'pageNo=1'
  const SgID = 'sgId=20200415'
  var NumOfRows = 'numOfRows=50'

  if (evPs) { //사전투표소인지 확인
    var url = BaseUrl1 + ServiceKey + "&" + PageNo + "&startPage=1&" + "&" + NumOfRows + "&" + "pageSize=10&" + SgID
  } else {
    var url = BaseUrl2 + ServiceKey + "&" + PageNo + "&startPage=1&" + "&" + NumOfRows + "&" + "pageSize=10&" + SgID
  }

  console.debug(addr)

}
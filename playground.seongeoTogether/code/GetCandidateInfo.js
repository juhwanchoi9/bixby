
var config = require('config')
var http = require("http")
var console = require("console")
var fail = require('fail')

const KEY = secret.get('key')
const BaseUrl = 'http://apis.data.go.kr/9760000/PofelcddInfoInqireService/getPofelcddRegistSttusInfoInqire?ServiceKey='
const ServiceKey = 'eQ0IAR7m%2BdkRw3fKhm8tjYGaVM6CwJe18Pt4ztgBb%2BAkkGeZloUhMKfQYT7qtMibLDoW5cYXnaA2ihOXlH0yPg%3D%3D'
const PageNo = 'pageNo=1'
const SgID = 'sgId=20200415'
const SgTypecode = 'sgTypecode=2'
const NumOfRows = 30

module.exports.function = function getCandidateInfo(location, jdName) {
  var url = BaseUrl + ServiceKey + "&" + PageNo + "&" + SgID + "&numOfRows=30" + "&" + SgTypecode

  try {
    var res = http.getUrl(url, { format: 'xmljs' })
    var ret = []
    if (res.response.body.totalCount == undefined) { return }
    if (res.response.body.totalCount > NumOfRows) {
      var count = NumOfRows
    } else {
      var count = res.response.body.totalCount
    }
    let List = res.response.body.items.item
    for (let i = 0; i < count; i++) {
      ret.push({
        'sggName': List[i].sggName,
        'sdName': List[i].sdName,
        'wiwName': List[i].wiwName,
        'jdNameResult': List[i].jdName,
        'name': List[i].name,
        'job': List[i].job,
        'gender': List[i].gender,
        'age': List[i].age,
        'huboId': List[i].huboid,
        'num': List[i].num,
        'giho': List[i].giho
      })
    }

    console.debug(ret)
    return ret

  }
  catch (err) {
  }
}
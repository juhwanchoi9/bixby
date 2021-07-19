var config = require('config')
var http = require("http")
var console = require("console")
var fail = require('fail')

const KEY = secret.get('key')
const BaseUrl = 'http://apis.data.go.kr/9760000/WinnerInfoInqireService2/getWinnerInfoInqire?serviceKey='
const ServiceKey = 'eQ0IAR7m%2BdkRw3fKhm8tjYGaVM6CwJe18Pt4ztgBb%2BAkkGeZloUhMKfQYT7qtMibLDoW5cYXnaA2ihOXlH0yPg%3D%3D'
const PageNo = 'pageNo=1'
const SgID = 'sgId=20200415'
const SgTypecode = 'sgTypecode=2'
const StartPage = 'startpage=1'
const PageSize = 'pagesize=10'
const NumOfRows = 50

module.exports.function = function getWinnerInfo(location, jdName) {
  // console.log(location)
  var url = BaseUrl + ServiceKey + "&" + PageNo + "&" + StartPage + "&" + "numOfRows=50" + "&" + PageSize + "&" + SgID + "&" + SgTypecode

  try {
    var res = http.getUrl(url, { format: 'xmljs' })
    var ret = []
    // console.debug(res.response.body.items.item)
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
        'giho': List[i].giho,
        'dugyul': List[i].dugyul
      })
    }
    // console.debug(ret)
    return ret
  }
  catch (err) {
  }
}
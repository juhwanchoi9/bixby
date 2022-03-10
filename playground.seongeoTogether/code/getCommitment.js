/******************** require ********************/
var config = require('config')
var http = require("http")
var console = require("console")
var fail = require('fail')

/******************** Constant ********************/
const KEY = secret.get('key')
const BaseUrl = 'http://apis.data.go.kr/9760000/ElecPrmsInfoInqireService/getCnddtElecPrmsInfoInqire?ServiceKey='
const ServiceKey = 'k6b%2BV7YJOhFvkSxbt8v30o4w7TS%2BHKnjtg0xhbmnA6reKklNmILinrm18QU7kkXqo49LLAdXUMA8kCCrO2VAXw%3D%3D'
const PageNo = 'pageNo=1'
const SgID = 'sgId=20210407'
const SgTypecode = 'sgTypecode=3'
/******************** Function ********************/
module.exports.function = function getCommitment(huboId,name) {

  var huboname = name;

  var url = BaseUrl + ServiceKey + "&" + PageNo + "&" + SgID + "&" + SgTypecode + "&cnddtId=" + huboId
  try {
    var res = http.getUrl(url, {format: 'xmljs'})
    var item = []

    if (res.response.body.items.item.prmsTitle1) {
        item.push({'cnddCommitment' : res.response.body.items.item.prmsTitle1,
                      'name'        : huboname,
                      'gongyakNum'  : "약속 하나"})
    }
    if (res.response.body.items.item.prmsTitle2) {
        item.push({'cnddCommitment' : res.response.body.items.item.prmsTitle2,
                      'name'        : huboname,
                      'gongyakNum'  : "약속 둘"})
    }
    if (res.response.body.items.item.prmsTitle3) {
        item.push({'cnddCommitment' : res.response.body.items.item.prmsTitle3,
                      'name'        : huboname,
                      'gongyakNum'  : "약속 셋"})
    }
    if (res.response.body.items.item.prmsTitle4) {
        item.push({'cnddCommitment' : res.response.body.items.item.prmsTitle4,
                      'name'        : huboname,
                      'gongyakNum'  : "약속 넷"})
    }
    if (res.response.body.items.item.prmsTitle5) {
        item.push({'cnddCommitment' : res.response.body.items.item.prmsTitle5,
                      'name'        : huboname,
                      'gongyakNum'  : "약속 다섯"})
    }
    return item
  } catch (err) {
    if (res.response) {
      if (res.response.header.resultCode) {
        if (res.response.header.resultCode == 'INFO-00' && res.response.body.totalCount == 0) {
          throw fail.checkedError("NoResult", "NoResult")
        }
      }
    } else if (res.result.code) {
      if (res.result.code == 'INFO-03') {
        throw fail.checkedError("NoData", "NoData")
      }
    }
  }
}

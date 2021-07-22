
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
  if (location) {
    //시 이름으로 들어왔을 때
    var test = location.name.valueOf()
    var test2 = location.unstructuredAddress.valueOf()
    if (test == "제주도") { test = "제주특별자치도" }
    if (test2 == "제주도") { test2 = "제주특별자치도" }
    if (test2.indexOf(",") != -1) {
      var str = test2.split(', ')
      if (str[0].length > str[1].length) {
        if (str[0].split(' ').length > 3) {
          var str2 = str[0].split(' ')
          var test3 = str2[0].valueOf()
          var test4 = str2[1].valueOf()
        }
      } else if (str[1].split(' ').length > 3) {
        var str2 = str[1].split(' ')
        var test3 = str2[0].valueOf()
        var test4 = str2[1].valueOf()
      }
      else {
        var test3 = str[0].valueOf()
        var test4 = str[1].valueOf()
      }
    } else { }
    //수원시팔달구
    if (location.name.length > 5) {
      if (test2.indexOf(" ") != -1) {
        var str = test2.split(' ')
        var test3 = str[0].valueOf()
        var test4 = str[1].valueOf()
      }
    } else { }

    if (test == test2) { //시정보만
      if (location.placeCategory == "administrative-region") {
        url += "&sdName=" + encodeURIComponent(test2) //서울특별시
      } else if (test.substr(test3.length - 1, 1) == "군") {
        url += "&sggName=" + encodeURIComponent(test)
      }
    } else if (str) {
      console.debug(str)
      if (test3 == "제주도") {
        test3 = "제주특별자치도"
      }
      if (test4 == "제주도") { test4 = "제주특별자치도" }
      var test3last = test3.substr(test3.length - 1, 1)
      var test4last = test4.substr(test4.length - 1, 1)

      if (test3last == "시" && test4last == "구") { //서울시 마포구
        console.debug("1" + test3) //수원시
        url += "&sdName=" + encodeURIComponent(test3);
        url += "&sggName=" + encodeURIComponent(test4);
      } else if (test3last == "도" || test4last == "시") { //경기도 수원시 
        console.debug("2" + test3)
        url += "&sdName=" + encodeURIComponent(test3);
        url += "&sggName=" + encodeURIComponent(test4);
      } else if (test3last == "도" && test4last == "군") { //경상남도 함양군
        console.debug("3" + test3)
        url += "&sdName=" + encodeURIComponent(test3);
        url += "&sggName=" + encodeURIComponent(test4);
      } else if (test4last == "시" && test3last == "구") { //마포구 서울시
        url += "&sdName=" + encodeURIComponent(test4);
        url += "&sggName=" + encodeURIComponent(test3);
      } else if (test4last == "도" || test3last == "시") {
        url += "&sdName=" + encodeURIComponent(test4);
        url += "&sggName=" + encodeURIComponent(test3);
      } else if (test4last == "도" && test3last == "군") {
        url += "&sdName=" + encodeURIComponent(test4);
        url += "&sggName=" + encodeURIComponent(test3);
      }
    } else if (location.placeCategory == "street-square") {
      var str2 = test2.split(' ')
      url += "&sdName=" + encodeURIComponent(str2[0]);  //경기도
      url += "&sggName=" + encodeURIComponent(str2[1]);
    } else if (location.placeCategory == "city-town-village") {
      console.debug("구정보")
      if (location.unstructuredAddress.substr(location.unstructuredAddress.length - 1) == "군") { //강화군
        url += "&sdName=" + encodeURIComponent(location.name);
        url += "&sggName=" + encodeURIComponent(test2);
      } else {
        url += "&sdName=" + encodeURIComponent(test2);  //서울특별시
        url += "&sggName=" + encodeURIComponent(location.name);
      }
    } else if (location.placeCategory != "city-town-village" || location.placeCategory != "street-square") {
      var str2 = test2.split(' ')
      // console.debug(str2) //경기도 파주시 파주읍 파주리
      url += "&sdName=" + encodeURIComponent(str2[0]);  //경기도
      url += "&sggName=" + encodeURIComponent(str2[1]);
    } else {
      //구정보
      // console.debug("나머지")
      url += "&sdName=" + encodeURIComponent(test2);  //서울특별시
      url += "&sggName=" + encodeURIComponent(location.name);
    }
  }
  if (jdName) {
    console.debug(jdName)
    if (jdName == "theminjoo") {
      url += "&jdName=" + encodeURIComponent("더불어민주당");
    } else if (jdName == "peopleparty") {
      url += "&jdName=" + encodeURIComponent("국민의당");
    } else if (jdName == "unitedfutureparty") {
      url += "&jdName=" + encodeURIComponent("미래통합당");
    } else if (jdName == "minsaengdang") {
      url += "&jdName=" + encodeURIComponent("민생당");
    } else if (jdName == "minjungparty") {
      url += "&jdName=" + encodeURIComponent("민중당");
    } else if (jdName == "libertyrepublican") {
      url += "&jdName=" + encodeURIComponent("자유공화당");
    } else if (jdName == "justice") {
      url += "&jdName=" + encodeURIComponent("정의당");
    } else if (jdName == "libertykoreaparty") {
      url += "&jdName=" + encodeURIComponent("자유한국당");
    } else if (jdName == "bareunmirae") {
      url += "&jdName=" + encodeURIComponent("바른미래당");
    } else if (jdName == "ourrepublicanparty") {
      url += "&jdName=" + encodeURIComponent("우리공화당");
    } else if (jdName == "nrdparty") {
      url += "&jdName=" + encodeURIComponent("국가혁명배당금당");
    } else if (jdName == "musosok") {
      url += "&jdName=" + encodeURIComponent("무소속");
    } else {
      throw fail.checkedError("NojdName", "NojdName")
    }
  }

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
    var temphuboidList = [];
    if (res.response.body.totalCount == 1) { //값이 1개일 때
      ret.push({
        'sggName': List.sggName,
        'sdName': List.sdName,
        'wiwName': List.wiwName,
        'jdNameResult': List.jdName,
        'name': List.name,
        'job': List.job,
        'gender': List.gender,
        'age': List.age,
        'huboId': List.huboid,
        'num': List.num,
        'giho': List.giho
      })
    } else {
      for (var i = 0; i < count; i++) {
        temphuboidList[i] = List[i].huboid
      }
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
    }
    console.debug(ret)
    return ret

  }
  catch (err) {

  }
}
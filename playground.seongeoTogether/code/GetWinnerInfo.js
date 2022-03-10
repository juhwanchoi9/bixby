var config = require('config')
var http = require("http")
var console = require("console")
var fail = require('fail')

const KEY = secret.get('key')
const BaseUrl = 'http://apis.data.go.kr/9760000/WinnerInfoInqireService2/getWinnerInfoInqire?serviceKey='
const ServiceKey = '1ue1B%2F%2BAyZt6YT5FD9QwHPsG%2BIAXeOU0zhlXlNKevbrnJPbJ81zInGB0jcGQ2QJWfqdHMsZUudy4fPjX0%2F1flQ%3D%3D'
const PageNo = 'pageNo=1'
const SgID = 'sgId=20210407'
// const SgTypecode = 'sgTypecode=3'
const StartPage = 'startpage=1'
const PageSize = 'pagesize=10'
const NumOfRows = 50

module.exports.function = function getWinnerInfo(location, jdName, sgTypecode) {
  if(sgTypecode){
    if(sgTypecode == "sgTypecode4"){
      SgTypecode = 'sgTypecode=4'
    } else if(sgTypecode == "sgTypecode5"){
      SgTypecode = 'sgTypecode=5'
    } else if(sgTypecode == "sgTypecode6"){
      SgTypecode = 'sgTypecode=6'
    } else {
      SgTypecode = 'sgTypecode=3'
    }
  } else {
    SgTypecode = 'sgTypecode=3'
  }
  
  var url = BaseUrl + ServiceKey + "&" + PageNo + "&" + StartPage + "&" + "numOfRows=50" + "&" + PageSize + "&" + SgID + "&" + SgTypecode
  var sggNameResult
  var sdNameResult
  var jdNameResult

  if (location) {
    var test = location.name.valueOf()
    var test2 = location.unstructuredAddress.valueOf()
    if (location.unstructuredAddress.valueOf().indexOf("서울특별시 한국") != -1) {
      test2 = location.unstructuredAddress.valueOf().substr(0, 5);
    }
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
        sdNameResult = test2
      } else if (test.substr(test3.length - 1, 1) == "군") {
        url += "&sggName=" + encodeURIComponent(test)
        sggNameResult = test
      }
    } else if (str) {
      if (test3 == "제주도") {
        test3 = "제주특별자치도"
      }
      if (test4 == "제주도") { test4 = "제주특별자치도" }
      var test3last = test3.substr(test3.length - 1, 1)
      var test4last = test4.substr(test4.length - 1, 1)
      if (test3 == "세종특별자치시" && test4last == "로") {
        url += "&sdName=" + encodeURIComponent(test3);
      } else if (test3last == "시" && test4last == "구") { //서울시 마포구
        url += "&sdName=" + encodeURIComponent(test3);
        url += "&sggName=" + encodeURIComponent(test4);
        sdNameResult = test3
        sggNameResult = test4
      } else if (test3last == "도" || test4last == "시") { //경기도 수원시 
        url += "&sdName=" + encodeURIComponent(test3);
        url += "&sggName=" + encodeURIComponent(test4);
        sdNameResult = test3
        sggNameResult = test4
      } else if (test3last == "도" && test4last == "군") { //경상남도 함양군
        url += "&sdName=" + encodeURIComponent(test3);
        url += "&sggName=" + encodeURIComponent(test4);
        sdNameResult = test3
        sggNameResult = test4
      } else if (test4last == "시" && test3last == "구") { //마포구 서울시
        url += "&sdName=" + encodeURIComponent(test4);
        url += "&sggName=" + encodeURIComponent(test3);
        sdNameResult = test4
        sggNameResult = test3
      } else if (test4last == "도" || test3last == "시") {
        url += "&sdName=" + encodeURIComponent(test4);
        url += "&sggName=" + encodeURIComponent(test3);
        sdNameResult = test4
        sggNameResult = test3
      } else if (test4last == "도" && test3last == "군") {
        url += "&sdName=" + encodeURIComponent(test4);
        url += "&sggName=" + encodeURIComponent(test3);
        sdNameResult = test4
        sggNameResult = test3
      }
    } else if (location.placeCategory == "street-square") {
      var str2 = test2.split(' ')
      url += "&sdName=" + encodeURIComponent(str2[0]);  //경기도
      url += "&sggName=" + encodeURIComponent(str2[1]);
      sdNameResult = str2[0]
      sggNameResult = str2[1]
    } else if (location.placeCategory == "city-town-village") {
      if (location.unstructuredAddress.substr(location.unstructuredAddress.length - 1) == "군") { //강화군
        url += "&sdName=" + encodeURIComponent(location.name);
        url += "&sggName=" + encodeURIComponent(test2);
        sdNameResult = location.name
        sggNameResult = test2
      } else {
        url += "&sdName=" + encodeURIComponent(test2);  //서울특별시
        url += "&sggName=" + encodeURIComponent(location.name);
        sdNameResult = test2
        sggNameResult = location.name
      }
    } else if (location.placeCategory != "city-town-village" || location.placeCategory != "street-square") {
      var str2 = test2.split(' ')
      url += "&sdName=" + encodeURIComponent(str2[0]);  //경기도
      url += "&sggName=" + encodeURIComponent(str2[1]);
      sdNameResult = str2[0]
      sggNameResult = str2[1]
    } else {
      //구정보
      url += "&sdName=" + encodeURIComponent(test2);  //서울특별시
      url += "&sggName=" + encodeURIComponent(location.name);
      sdNameResult = test2
      sggNameResult = location.name
    }
  }

  if (jdName) {
    if (jdName == "theminjoo") {
      url += "&jdName=" + encodeURIComponent("더불어민주당");
      jdNameResult = "더불어민주당"
    } else if (jdName == "peopleparty") {
      url += "&jdName=" + encodeURIComponent("국민의당");
      jdNameResult = "국민의당"
    } else if (jdName == "unitedfutureparty") {
      url += "&jdName=" + encodeURIComponent("국민의힘");
      jdNameResult = "국민의힘"
    } else if (jdName == "minsaengdang") {
      url += "&jdName=" + encodeURIComponent("민생당");
      jdNameResult = "민생당"
    } else if (jdName == "minjungparty") {
      url += "&jdName=" + encodeURIComponent("민중당");
      jdNameResult = "민중당"
    } else if (jdName == "libertyrepublican") {
      url += "&jdName=" + encodeURIComponent("자유공화당");
      jdNameResult = "자유공화당"
    } else if (jdName == "justice") {
      url += "&jdName=" + encodeURIComponent("정의당");
      jdNameResult = "정의당"
    } else if (jdName == "libertykoreaparty") {
      url += "&jdName=" + encodeURIComponent("자유한국당");
      jdNameResult = "자유한국당"
    } else if (jdName == "bareunmirae") {
      url += "&jdName=" + encodeURIComponent("바른미래당");
      jdNameResult = "바른미래당"
    } else if (jdName == "ourrepublicanparty") {
      url += "&jdName=" + encodeURIComponent("우리공화당");
      jdNameResult = "우리공화당"
    } else if (jdName == "nrdparty") {
      url += "&jdName=" + encodeURIComponent("국가혁명배당금당");
      jdNameResult = "국가형명배당금당"
    } else if (jdName == "makeourfuture") {
      url += "&jdName=" + encodeURIComponent("미래당");
      jdNameResult = "미래당"
    } else if (jdName == "musosok") {
      url += "&jdName=" + encodeURIComponent("무소속");
      jdNameResult = "무소속"
    } else {
      throw fail.checkedError("NojdName", "NojdName")
    }
  }

   ////////////////////////////////////////////20210407 선거
   var sgTypecodeCheck

   if(!jdNameResult){
     if(!sggNameResult && !sdNameResult){
        sggNameResult = "서울" //서울,부산 지역 아닌 없는 경우와 구분하기 위함
        sdNameResult = ""
      }else if(!sggNameResult){
        sggNameResult = ""
      }

      if(sdNameResult.indexOf('서울')!=-1 || sdNameResult.indexOf('부산')!=-1 ||
          sdNameResult.indexOf('경기')!=-1 || sdNameResult.indexOf('울산')!=-1 ||
          sdNameResult.indexOf('경상남도')!=-1 || sdNameResult.indexOf('충청북도')!=-1 ||
          sdNameResult.indexOf('전라남도')!=-1 || sdNameResult.indexOf('충청남도')!=-1 ||
          sdNameResult.indexOf('전라북도')!=-1){
            if(sggNameResult){
              if(sggNameResult.indexOf('강북')!=-1 || sggNameResult.indexOf('송파')!=-1 || sggNameResult.indexOf('영등포')!=-1){
              }else{
                sggNameResult = "" //api 시 값만 보냄
              }
            }
        //선거구가 맞음
        sgTypecodeCheck = "선거구"
      }else {
        if(!sdNameResult && sggNameResult == "서울"){

        }else {
          //선거구가 아닐때
          throw fail.checkedError("NoData2", "NoData2")
        }        
      }
   }

  /////////////////////////////////////////////////////////////

  try {
    var res = http.getUrl(url, { format: 'xmljs' })
    var ret = []
    if (res.result) { //정보 업데이트 전
      if (res.result.code == 'INFO-03') {
        var checkCode = "checkCode"
        ret.push({
          'sggName': sggNameResult,
          'sdName': sdNameResult,
          'jdNameResult': jdNameResult,
          'checkCode': checkCode
        })
      }
    }
    if (checkCode) {
      return ret 
    }
    if (!checkCode) {
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
          'giho': List.giho,
          'dugyul': List.dugyul
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
            'giho': List[i].giho,
            'dugyul': List[i].dugyul
          })
        }
      }
    }
    return ret
  }
  catch (err) {
    if (res.response) {
      if (res.response.header.resultCode) {
        if (res.response.header.resultCode == 'INFO-00' && res.response.body.totalCount == 0) {
          throw fail.checkedError("NoResult", "NoResult")
        } else if (res.response.header.resultCode == 'INFO-03'){
          throw fail.checkedError("NoData", "NoData")
        }
      }
    }
  }
}
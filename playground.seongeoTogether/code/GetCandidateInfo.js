/******************** require ********************/
var config = require('config')
var http = require("http")
var console = require("console")
var fail = require('fail')
/******************** Constant ********************/
const KEY = secret.get('key')
const BaseUrl = 'http://apis.data.go.kr/9760000/PofelcddInfoInqireService/getPofelcddRegistSttusInfoInqire?ServiceKey='
const ServiceKey = 'eQ0IAR7m%2BdkRw3fKhm8tjYGaVM6CwJe18Pt4ztgBb%2BAkkGeZloUhMKfQYT7qtMibLDoW5cYXnaA2ihOXlH0yPg%3D%3D'
const PageNo = 'pageNo=1'
const SgID = 'sgId=20210407' //20200415
//const SgTypecode = 'sgTypecode=3' //2  //기본값 시도지사 선거
const NumOfRows = 30
/******************** Function ********************/
/******************** Function(Main) ********************/
module.exports.function = function getCandidateInfo(location, jdName, sgTypecode) {
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

  var url = BaseUrl + ServiceKey + "&" + PageNo + "&" + SgID + "&numOfRows=30" + "&" + SgTypecode

  var sdNameUrl
  var sggNameUrl

  if (location) {
    //시 이름으로 들어왔을 때
    var test = location.name.valueOf()
    var test2 = location.unstructuredAddress.valueOf()
    if(location.unstructuredAddress.valueOf().indexOf("서울특별시 한국") != -1){
      test2 = location.unstructuredAddress.valueOf().substr(0,5);
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
        sdNameUrl = test2 //서울특별시
      } else if (test.substr(test3.length - 1, 1) == "군") {
        sggNameUrl = test
      }
    } else if (str) {
      if (test3 == "제주도") {
        test3 = "제주특별자치도"
      }
      if (test4 == "제주도") { test4 = "제주특별자치도" }
      var test3last = test3.substr(test3.length - 1, 1)
      var test4last = test4.substr(test4.length - 1, 1)
	  if (test3 == "세종특별자치시" && test4last == "로") {
        sdNameUrl = test3;
      } else if (test3last == "시" && test4last == "구") { //서울시 마포구
        sdNameUrl = test3;
        sggNameUrl = test4;
      } else if (test3last == "도" || test4last == "시") { //경기도 수원시 
        sdNameUrl = test3;
        sggNameUrl = test4;
      } else if (test3last == "도" && test4last == "군") { //경상남도 함양군
        sdNameUrl = test3;
        sggNameUrl = test4;
      } else if (test4last == "시" && test3last == "구") { //마포구 서울시
        sdNameUrl = test4;
        sggNameUrl = test3;
      } else if (test4last == "도" || test3last == "시") {
        sdNameUrl = test4;
        sggNameUrl = test3;
      } else if (test4last == "도" && test3last == "군") {
        sdNameUrl = test4;
        sggNameUrl = test3;
      }
    } else if (location.placeCategory == "street-square") {
      var str2 = test2.split(' ')
      sdNameUrl = str2[0];  //경기도
      sggNameUrl = str2[1];
    } else if (location.placeCategory == "city-town-village") {
      if (location.unstructuredAddress.substr(location.unstructuredAddress.length - 1) == "군") { //강화군
        sdNameUrl = location.name;
        sggNameUrl = test2;
      } else {
        sdNameUrl = test2;  //서울특별시
        sggNameUrl = location.name;
      }
    } else if (location.placeCategory != "city-town-village" || location.placeCategory != "street-square") {
      var str2 = test2.split(' ')
      sdNameUrl = str2[0];  //경기도
      sggNameUrl = str2[1];
    } else {
      sdNameUrl = test2;  //서울특별시
      sggNameUrl = location.name;
    }
  }    

  if (jdName) {
    if (jdName == "theminjoo") {
      url += "&jdName=" + encodeURIComponent("더불어민주당");
    } else if (jdName == "peopleparty") {
      url += "&jdName=" + encodeURIComponent("국민의당");
    } else if (jdName == "unitedfutureparty") {
      url += "&jdName=" + encodeURIComponent("국민의힘");
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
    } else if (jdName == "makeourfuture") {
      url += "&jdName=" + encodeURIComponent("미래당");
    } else if (jdName == "musosok") {
      url += "&jdName=" + encodeURIComponent("무소속");
    } else {
      throw fail.checkedError("NojdName", "NojdName")
    }
  }

  
    /////////////////////////////////////////20210407 선거
    var sgTypecodeCheck
    if(!sggNameUrl && !sdNameUrl){
      if(jdName){
        sdNameUrl = ""
        sggNameUrl = ""
      }else{
        sggNameUrl = "서울" //서울,부산 지역 아닌 없는 경우와 구분하기 위함
        sdNameUrl = ""
        }
        
      }else if(!sggNameUrl){
        sggNameUrl = ""
      }

     if(sdNameUrl.indexOf('서울')!=-1 || sdNameUrl.indexOf('부산')!=-1 ||
          sdNameUrl.indexOf('경기')!=-1 || sdNameUrl.indexOf('울산')!=-1 ||
          sdNameUrl.indexOf('경상남도')!=-1 || sdNameUrl.indexOf('충청북도')!=-1 ||
          sdNameUrl.indexOf('전라남도')!=-1 || sdNameUrl.indexOf('충청남도')!=-1 ||
          sdNameUrl.indexOf('전라북도')!=-1){
            if(sggNameUrl){
              if(sggNameUrl.indexOf('강북')!=-1 || sggNameUrl.indexOf('송파')!=-1 || sggNameUrl.indexOf('영등포')!=-1){
              }else{
                sggNameUrl = "" //api 시 값만 보냄
              }
            }
        //선거구가 맞음
        sgTypecodeCheck = "선거구"
        }else if(!jdName){
          //선거구가 아닐때
          if(!sdNameUrl && sggNameUrl == "서울"){
  
          } else {
            throw fail.checkedError("NoData2", "NoData2")
          }
      }

   if (sggNameUrl!="" && sdNameUrl){
     url += "&sdName=" + encodeURIComponent(sdNameUrl) + "&sggName=" + encodeURIComponent(sggNameUrl)
   } else if (sdNameUrl && !sggNameUrl){
     url += "&sdName=" + encodeURIComponent(sdNameUrl)
     } else {
       url
     } 
    /////////////////////////////////////////////////////////////

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
    return ret

  }
  catch (err) {
    if (res.response) {
      if (res.response.header.resultCode) {
        if (res.response.header.resultCode == 'INFO-00' && res.response.body.totalCount == 0) {
          throw fail.checkedError("NoResult", "NoResult")
        }
      }
    } else if (res.result.code) {
      if (res.result.code == 'INFO-03') {
        if (!sgTypecodeCheck) {
          throw fail.checkedError("NoData", "NoData")
        }
        throw fail.checkedError("NoData3", "NoData3")
      }
    }
  }
}
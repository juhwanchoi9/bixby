var console = require('console')
var http = require("http")
var fail = require('fail')

module.exports.function = function findPoint(addr, evPs, near, countryDivision) {
  const KEY = secret.get('key')
  const BaseUrl1 = 'http://apis.data.go.kr/9760000/PolplcInfoInqireService2/getPrePolplcOtlnmapTrnsportInfoInqire?serviceKey='
  //사전
  const BaseUrl2 = 'http://apis.data.go.kr/9760000/PolplcInfoInqireService2/getPolplcOtlnmapTrnsportInfoInqire?serviceKey='
  //선거일
  const ServiceKey = 'eQ0IAR7m%2BdkRw3fKhm8tjYGaVM6CwJe18Pt4ztgBb%2BAkkGeZloUhMKfQYT7qtMibLDoW5cYXnaA2ihOXlH0yPg%3D%3D'
  const PageNo = 'pageNo=1'
  const SgID = 'sgId=20200415'

  if (addr) {
    var test = addr.name.valueOf()
    if (addr.unstructuredAddress) {
      var test2 = addr.unstructuredAddress.valueOf()
    }
    if (test == test2) {
      var NumOfRows = 'numOfRows=400' //시 정보만 들어왔을때 데이터를 많이 받아오기 위한
    } else {
      var NumOfRows = 'numOfRows=70'
    }
  } else {
    var NumOfRows = 'numOfRows=70'
  }

  if (evPs) {
    var url = BaseUrl1 + ServiceKey + "&" + PageNo + "&startPage=1&" + "&" + NumOfRows + "&" + "pageSize=10&" + SgID
  } else {
    var url = BaseUrl2 + ServiceKey + "&" + PageNo + "&startPage=1&" + "&" + NumOfRows + "&" + "pageSize=10&" + SgID
  }

  console.debug(addr)

  var checkCurLocation
  if (addr) {
    if (test == test2) {
      if (test == "제주도") {
        url += "&sdName=" + encodeURIComponent("제주특별자치도")
      } else if (test.substr(test.length - 1, 1) == "군") { //옹진군
        url += "&sdName=" + encodeURIComponent(countryDivision.locality)  //인천광역시
        url += "&wiwName=" + encodeURIComponent(countryDivision.subLocalityOne); //매소홀로
      } else {
        url += "&sdName=" + encodeURIComponent(addr.unstructuredAddress)
      }
    } else if (countryDivision.levelOne) {
      if (countryDivision.country.type == "Country" && addr.placeCategory == "street-square" || addr.placeCategory == "education-facility") {
        if (countryDivision.levelOne.name == "제주도") {
          var jeju = "제주특별자치도"
          url += "&sdName=" + encodeURIComponent(jeju)
        } else {
          url += "&sdName=" + encodeURIComponent(countryDivision.levelOne.name)  //전라북도
        }
        url += "&wiwName=" + encodeURIComponent(countryDivision.locality); //군산시
      } else if (addr.placeCategory == "city-town-village" && addr.name.length > 5) { //wiwName
        if (countryDivision.levelOne.name == "제주도") {
          var jeju = "제주특별자치도"
          url += "&sdName=" + encodeURIComponent(jeju)
        } else {
          url += "&sdName=" + encodeURIComponent(countryDivision.levelOne.name)  //전라북도
        }
        url += "&wiwName=" + encodeURIComponent(addr.name); //전주시완산구
      } else if (addr.placeCategory == "city-town-village"
        && countryDivision.locality.substr(countryDivision.locality.length - 1) == "시") { //읍면동
        //경기 지역 등에서 wiwName에 시만 들어가면 결과값이 나오지 않는 경우를 대비
        //'수원시영통구'처럼 시와 구를 붙여 보냄
        url += "&sdName=" + encodeURIComponent(countryDivision.levelOne.name)  //전라북도
        if (!countryDivision.subLocalityOne) { //제주 서귀포시
          url += "&wiwName=" + encodeURIComponent(countryDivision.locality)
        } else {
          url += "&wiwName=" + encodeURIComponent(countryDivision.locality) + encodeURIComponent(countryDivision.subLocalityOne);
        }
      } else if (addr.placeCategory == "city-town-village") { //읍면동
        url += "&sdName=" + encodeURIComponent(countryDivision.levelOne.name)  //전라북도
        url += "&wiwName=" + encodeURIComponent(countryDivision.locality);
      }
    } else {
      url += "&sdName=" + encodeURIComponent(countryDivision.locality)  //서울특별시
      url += "&wiwName=" + encodeURIComponent(countryDivision.subLocalityOne);
    }
  } else {
    //현재위치
    if (near.subLocalityFour) {
      url += "&sdName=" + encodeURIComponent(near.levelOne.name); //경기도
      url += "&wiwName=" + encodeURIComponent(near.locality) + encodeURIComponent(near.subLocalityOne); //안산시상록구
      checkCurLocation = "checkCurLocation"
    } else if (near.levelOne) {
      if (near.levelOne.name.indexOf("제주") != -1) {
        url += "&sdName=" + encodeURIComponent("제주특별자치도");  //서울특별시
        url += "&wiwName=" + encodeURIComponent(near.locality); //마포구
        checkCurLocation = "checkCurLocation"
      } else {
        url += "&sdName=" + encodeURIComponent(near.levelOne.name); 
        url += "&wiwName=" + encodeURIComponent(near.locality) + encodeURIComponent(near.subLocalityOne); //수원시매탄동
        checkCurLocation = "checkCurLocation"
      }
    } else {
      url += "&sdName=" + encodeURIComponent(near.locality);  //서울특별시
      url += "&wiwName=" + encodeURIComponent(near.subLocalityOne); //마포구
      checkCurLocation = "checkCurLocation"
    }
  }

  try {
    var res = http.getUrl(url, { format: 'xmljs' })
    var ret = []
    if (res.response.body.items.item.length == undefined) { return }
    if (res.response.body.items.item.length == 0) { return }
    let List = res.response.body.items.item
    if (evPs) {
      if (checkCurLocation) { // 현재위치가 들어왔을때 리턴값
        for (let i = 0; i < List.length; i++) {
          ret.push({
            'location': List[i].evPsName,
            'sdName': List[i].sdName,
            'wiwName': List[i].wiwName,
            'addr': List[i].addr,
            'placeName': List[i].placeName,
            'floor': List[i].floor,
            'checkCurLocation': checkCurLocation
          })
        }
      } else {
        if (addr.placeCategory == "street-square" || addr.placeCategory == "city-town-village") {
          if (addr.name.length > 5) { //전주시완산구
            for (let i = 0; i < List.length; i++) {
              ret.push({
                'location': List[i].evPsName,
                'sdName': List[i].sdName,
                'wiwName': List[i].wiwName,
                'addr': List[i].addr,
                'placeName': List[i].placeName,
                'floor': List[i].floor
              })
            }
          }
          else {
            for (let i = 0; i < List.length; i++) { //동정보
              if (List[i].addr.indexOf(addr.name) != -1) {
                ret.push({
                  'location': List[i].evPsName,
                  'sdName': List[i].sdName,
                  'wiwName': List[i].wiwName,
                  'addr': List[i].addr,
                  'placeName': List[i].placeName,
                  'floor': List[i].floor
                })
              }
            }
          }
        } else {
          for (let i = 0; i < List.length; i++) { //나머지
            ret.push({
              'location': List[i].evPsName,
              'sdName': List[i].sdName,
              'wiwName': List[i].wiwName,
              'addr': List[i].addr,
              'placeName': List[i].placeName,
              'floor': List[i].floor
            })
          }
        }
      }
    } else {
      if (checkCurLocation) { // 현재위치가 들어왔을때 리턴값
        for (let i = 0; i < List.length; i++) {
          if (List[i].psName.indexOf("투표소") == -1) {
            ret.push({
              'location': List[i].psName + "표소",
              'sdName': List[i].sdName,
              'wiwName': List[i].wiwName,
              'addr': List[i].addr,
              'placeName': List[i].placeName,
              'floor': List[i].floor,
              'checkCurLocation': checkCurLocation
            })
          } else {
            ret.push({
              'location': List[i].psName,
              'sdName': List[i].sdName,
              'wiwName': List[i].wiwName,
              'addr': List[i].addr,
              'placeName': List[i].placeName,
              'floor': List[i].floor,
              'checkCurLocation': checkCurLocation
            })
          }
        }
      } else {
        if (addr.placeCategory == "street-square") {
          //  console.debug("동정보")
          for (let i = 0; i < List.length; i++) { //동정보
          var name = addr.name.replace(/[^0-9]/g,"")
            if (name) {
              if (List[i].psName.indexOf(addr.name) != -1) {
                if (List[i].psName.indexOf("투표소") == -1) {
                  ret.push({
                    'location': List[i].psName + "표소",
                    'sdName': List[i].sdName,
                    'wiwName': List[i].wiwName,
                    'addr': List[i].addr,
                    'placeName': List[i].placeName,
                    'floor': List[i].floor
                  })
                } else {
                  ret.push({
                    'location': List[i].psName,
                    'sdName': List[i].sdName,
                    'wiwName': List[i].wiwName,
                    'addr': List[i].addr,
                    'placeName': List[i].placeName,
                    'floor': List[i].floor
                  })
                }
              }
            } else if (List[i].addr.indexOf(addr.name) != -1) {
              if (List[i].psName.indexOf("투표소") == -1) {
                ret.push({
                  'location': List[i].psName + "표소",
                  'sdName': List[i].sdName,
                  'wiwName': List[i].wiwName,
                  'addr': List[i].addr,
                  'placeName': List[i].placeName,
                  'floor': List[i].floor
                })
              } else {
                ret.push({
                  'location': List[i].psName,
                  'sdName': List[i].sdName,
                  'wiwName': List[i].wiwName,
                  'addr': List[i].addr,
                  'placeName': List[i].placeName,
                  'floor': List[i].floor
                })
              }
            }
          }
        } else {
          for (let i = 0; i < List.length; i++) { //나머지
            if (List[i].psName.indexOf("투표소") == -1) {
              ret.push({
                'location': List[i].psName + "표소",
                'sdName': List[i].sdName,
                'wiwName': List[i].wiwName,
                'addr': List[i].addr,
                'placeName': List[i].placeName,
                'floor': List[i].floor
              })
            } else {
              ret.push({
                'location': List[i].psName,
                'sdName': List[i].sdName,
                'wiwName': List[i].wiwName,
                'addr': List[i].addr,
                'placeName': List[i].placeName,
                'floor': List[i].floor
              })
            }
          }
        }
      }
    }
    if (ret.length == 0) {
      throw fail.checkedError("NoResultVote", "NoResultVote")
    }
    console.debug(ret)
    return ret
  }
  catch (err) {
    if (ret.length == 0) {
      throw fail.checkedError("NoResultVote", "NoResultVote")
    }
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
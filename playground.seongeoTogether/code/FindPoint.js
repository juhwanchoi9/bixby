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
    const SgID = 'sgId=20210407'

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

    var sdNameUrl
    var wiwNameUrl

    var checkCurLocation
    if (addr) {
      if (test == test2) {
        if (test == "제주도") {
          sdNameUrl = "제주특별자치도"
        } else if (test.substr(test.length - 1, 1) == "군") { //옹진군
          sdNameUrl = countryDivision.locality  //인천광역시
          wiwNameUrl = countryDivision.subLocalityOne; //매소홀로
        } else {
          sdNameUrl = addr.unstructuredAddress
        }
      } else if (countryDivision.levelOne) {
        if (countryDivision.country.type == "Country" && addr.placeCategory == "street-square" || addr.placeCategory == "education-facility") {
          if (countryDivision.levelOne.name == "제주도") {
            var jeju = "제주특별자치도"
            sdNameUrl = jeju
          } else {
            sdNameUrl = countryDivision.levelOne.name  //전라북도
          }
          wiwNameUrl = countryDivision.locality; //군산시
        } else if (addr.placeCategory == "city-town-village" && addr.name.length > 5) { //wiwName
          if (countryDivision.levelOne.name == "제주도") {
            var jeju = "제주특별자치도"
            sdNameUrl = jeju
          } else {
            sdNameUrl = countryDivision.levelOne.name  //전라북도
          }
          wiwNameUrl = addr.name; //전주시완산구
        } else if (addr.placeCategory == "city-town-village"
          && countryDivision.locality.substr(countryDivision.locality.length - 1) == "시") { //읍면동
          //경기 지역 등에서 wiwName에 시만 들어가면 결과값이 나오지 않는 경우를 대비
          //'수원시영통구'처럼 시와 구를 붙여 보냄
          sdNameUrl = countryDivision.levelOne.name  //전라북도
          if (!countryDivision.subLocalityOne) { //제주 서귀포시
            wiwNameUrl = countryDivision.locality
          } else {
            wiwNameUrl = countryDivision.locality + countryDivision.subLocalityOne;
          }
        } else if (addr.placeCategory == "city-town-village") { //읍면동
          sdNameUrl = countryDivision.levelOne.name  //전라북도
          wiwNameUrl = countryDivision.locality;
        } else {
          var str = test2.split(' ')
          if (str[2]) {
            sdNameUrl = str[0].valueOf()
            wiwNameUrl = str[1].valueOf();
          }
        }
      } else {
        if (countryDivision.subLocalityOne) {
          sdNameUrl = countryDivision.locality  //서울특별시
          wiwNameUrl = countryDivision.subLocalityOne;
        }
        url += "&sdName=" + encodeURIComponent(countryDivision.locality)  //세종
      }
    } else {
      //현재위치
      if (near.subLocalityFour) {
        if (!near.levelOne) {
          sdNameUrl = near.locality; //서울특별시
          wiwNameUrl = near.subLocalityOne; //관악구 (미성동)
          checkCurLocation = "checkCurLocation"
        } else if (near.levelOne.name){
            sdNameUrl = near.levelOne.name; //경기도
          wiwNameUrl = near.locality + near.subLocalityOne; //안산시상록구
          checkCurLocation = "checkCurLocation"
        }
      } else if (near.levelOne) {
        if (near.levelOne.name.indexOf("제주") != -1) {
          sdNameUrl = "제주특별자치도";  //서울특별시
          wiwNameUrl = near.locality; //마포구
          checkCurLocation = "checkCurLocation"
        } else {
          sdNameUrl = near.levelOne.name;
          wiwNameUrl = near.locality + near.subLocalityOne; //수원시매탄동
          checkCurLocation = "checkCurLocation"
        }
      } else {
        sdNameUrl = near.locality;  //서울특별시
        wiwNameUrl = near.subLocalityOne; //마포구
        checkCurLocation = "checkCurLocation"
      }
    }
    
    /////////////////////////////////////////20210407 선거
    var sgTypecodeCheck
      if(!wiwNameUrl){
        wiwNameUrl = ""
      }
       if(sdNameUrl.indexOf('서울')!=-1 || sdNameUrl.indexOf('부산')!=-1 ||
          sdNameUrl.indexOf('경기')!=-1 || sdNameUrl.indexOf('울산')!=-1 ||
          sdNameUrl.indexOf('경상남도')!=-1 || sdNameUrl.indexOf('충청북도')!=-1 ||
          sdNameUrl.indexOf('전라남도')!=-1 || sdNameUrl.indexOf('충청남도')!=-1 ||
          sdNameUrl.indexOf('전라북도')!=-1){
            if(wiwNameUrl){
              if(sdNameUrl.indexOf('서울')!=-1 || sdNameUrl.indexOf('부산')!=-1){

              }else if(wiwNameUrl.indexOf('강북')!=-1 || wiwNameUrl.indexOf('송파')!=-1 || wiwNameUrl.indexOf('영등포')!=-1 ||
                       wiwNameUrl.indexOf('남구')!=-1 || wiwNameUrl.indexOf('의령')!=-1 || wiwNameUrl.indexOf('구리')!=-1 ||
                       wiwNameUrl.indexOf('보은')!=-1 || wiwNameUrl.indexOf('순천')!=-1 || wiwNameUrl.indexOf('고흥')!=-1 ||
                       wiwNameUrl.indexOf('함양')!=-1 || wiwNameUrl.indexOf('울주')!=-1 || wiwNameUrl.indexOf('예산')!=-1 ||
                       wiwNameUrl.indexOf('고성')!=-1 || wiwNameUrl.indexOf('파주')!=-1 || wiwNameUrl.indexOf('함안')!=-1 ||
                       wiwNameUrl.indexOf('김제')!=-1 || wiwNameUrl.indexOf('보성')!=-1){
              }else{
                wiwNameUrl = "" //api 시 값만 보냄
              }
            }
        //선거구가 맞음
      sgTypecodeCheck = "선거구"
      }else {
        //선거구가 아닐때
        throw fail.checkedError("NoData2", "NoData2")
      }
      /////////////////////////////////////////////////////////////

     if (wiwNameUrl){
       url += "&sdName=" + encodeURIComponent(sdNameUrl) + "&wiwName=" + encodeURIComponent(wiwNameUrl)
     } else {
       url += "&sdName=" + encodeURIComponent(sdNameUrl)
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
            for (let i = 0; i < List.length; i++) { //동정보
              var name = addr.name.replace(/[^0-9]/g, "")
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
          if (sgTypecodeCheck) {
            throw fail.checkedError("NoData2", "NoData2")
            }
          throw fail.checkedError("NoData", "NoData")
        }
      } else if (ret.length == 0) { //투표소가 없는 지역?
        throw fail.checkedError("NoResultVote", "NoResultVote")
        }
    }
  }
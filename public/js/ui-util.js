var gIsMobile;

var guagePoints = [
  {
    steps: 4000,
    percent: 17.5,
    cpnTyp: "discnt4000"
  },
  {
    steps: 10000,
    percent: 35.7,
    cpnTyp: "discnt10000"
  },
  {
    steps: 15000,
    percent: 55,
    cpnTyp: "coffee"
  },
  {
    steps: 40000,
    percent: 92,
    cpnTyp: "discnt40000"
  },
  {
    steps: 40001,
    percent: 96.6,
    cpnTyp: null
  }
];

function scrollTo(id) {
	document.getElementById(id).scrollIntoView()	
}

function refresh() {
	//location.reload();
	initialize();
}

function isNativeMobile() {
  return ((typeof webkit) !== "undefined") || ((typeof window.android) !== "undefined");
}

function isIOS() {
	return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i)	
}

function isAndroid() {
	return navigator.userAgent.match(/(android)/i)	
}

function isMobile() {
	return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
}

function startCountDown(rgstDtm, id) {
	var startDate  = parseDtmStrtoDate(rgstDtm);
	var dayEndDate = parseDtmStrtoDate(getToday());
	dayEndDate.setHours(23,59,59,999);
	//_startCountDown(dayEndDate, startDate, id);
}

function _startCountDown(endDate, startDate, id) {
  // Update the count down every 1 second
  var date = startDate;
  var timer = setInterval(function () {
    var distance = endDate - date;
    console.log("distance:", distance)

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    //$(id).text(days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    if (seconds < 10) seconds = '0' + seconds;
    // $(id).text(hours + ":" + minutes + ":" + seconds + "");

    var hour10 = Math.floor(hours / 10);
    var hour1 = hours % 10;
    var minute10 = Math.floor(minutes / 10);
    var minute1 = minutes % 10;
    var second10 = Math.floor(seconds / 10);
    var second1 = seconds % 10;

    $("#hour10").text(hour10);
    $("#hour1").text(hour1);
    $("#minute10").text(minute10);
    $("#minute1").text(minute1);
    $("#second10").text(second10);
    $("#second1").text(second1);
    // console.log(hours + ":" + minutes + ":" + seconds + "");
    // console.log("" + hour10 + hour1 + ":" + minute10 + minute1 + ":" + second10 + second1 + "");

    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(timer);
      // $(id).text('EXPIRED');
      $("#hour10").text(0);
      $("#hour1").text(0);
      $("#minute10").text(0);
      $("#minute1").text(0);
      $("#second10").text(0);
      $("#second1").text(0);
    }
    date.setSeconds(date.getSeconds() + 1);
  }, 1000);
  return timer;
}

function updateStepsUI(steps) {
  var tmpSteps = steps;
  if (tmpSteps >= 100000) {
    tmpSteps = 99999;
  }
  for (var i = 4; i >= 0; i--) {
    var divider = Math.pow(10, i);
    var num = Math.floor(tmpSteps / divider);
    tmpSteps = tmpSteps - divider * num;
    // console.log(divider, num);
    var id = "#steps" + divider;
    $(id).text(num);
  }
}

function updateProgress(steps) {
  var multiplier = 0;
  var idx = 0;
  var foundItem = guagePoints.find(function (item, index) {
    idx = index;
    // console.log(steps, item.steps)
    return steps <= item.steps;
  });
  // console.log(foundItem);

  var sizePercent = foundItem.percent;
  var sizeSteps = foundItem.steps;
  var previousPointSteps = 0;
  var previousPointPercent = 0;
  if (idx > 0) {
    previousPointSteps = guagePoints[idx - 1].steps;
    previousPointPercent = guagePoints[idx - 1].percent;
    sizePercent -= guagePoints[idx - 1].percent;
    sizeSteps -= guagePoints[idx - 1].steps;
  }

  var remainSteps = steps - previousPointSteps;
  var addingPercent = sizePercent * (remainSteps / sizeSteps);
  var guageProgress = previousPointPercent + addingPercent;
  // console.log(guageProgress, previousPointPercent, addingPercent)
  $("#guageProgress").css("width", guageProgress + "%");
}

function getSuccessSteps(stpCnt) {
  var successSteps = 0;
  for (var i = 0; i < guagePoints.length; i++) {
    if (stpCnt >= guagePoints[i]) {
      successSteps = guagePoints[i].steps;
    }
  }
  if (successSteps > 40000) {
    successSteps = 40000;
  }
  return successSteps;
}

function updateGettingCouponArea(stpCnt) {
  if (stpCnt < guagePoints[0].steps) {
    $("#get-coupon-wrapper-mobile").hide();
    return;
  }
  $("#get-coupon-wrapper-mobile").show();

  var currentDate = new Date();
  var lastTimeOfToday = lastTimeOfTheDay(currentDate);
  _startCountDown(new Date(), lastTimeOfToday, "id");

  var successSteps = getSuccessSteps(stpCnt);
  $("#successCount").text(successSteps);
}

var agreed = false;

function appFunctionPedometer() {
  console.log('appFuncPedometer');
  location.href = "toapp:::AppFunction:::Pedometer";
}

// UI 관련
function setEventListners() {

  // START 클릭
  $("#btnApply-mobile").click(function () {
    // TODO: 기존에 동의 했는지 체크하는 부분 필요함
	console.log('00');
    var isAlreadyAgreed = false;
    if (!isAlreadyAgreed) {
      $("#agree-modal").modal("show");
      return;
    }
    appFunctionPedometer();
  });

  // 약관 동의 체크박스
  $("#agree-check-button-area").click(function () {
    $("#agree-check-button-marker").show();
    $("#not-agree-check-button-marker").hide();
    $("#agree-ok-button").css("background-color", "#132daa");
    $("#agree-ok-img").css("opacity", "1");
    agreed = true;
  });

  // 약관 비동의 체크박스
  $("#not-agree-check-button-area").click(function () {
    $("#agree-check-button-marker").hide();
    $("#not-agree-check-button-marker").show();
    $("#agree-ok-button").css("background-color", "#404040");
    $("#agree-ok-img").css("opacity", "0.5");
    agreed = false;
  });

  // 약관 동의 확인버튼
  $("#agree-ok-button").click(function () {
    if (!agreed) {
      return;
    }
    $("#agree-modal").modal("hide");
    $("#event-intro-modal").modal("show");
  });

  // 이벤트 안내창 창닫기 버튼
  $("#event-intro-close-button").click(function () {
    $("#event-intro-modal").modal("hide");
    appFunctionPedometer();
  });
}

// for test
function updateSteps() {
  var steps = 39000;
  updateStepsUI(steps);
  updateProgress(steps);
  _startCountDown(new Date("2019-10-01 01:01:05"), new Date("2019-10-01 00:00:00"), "id");
}

function renderCouponsOfModal() {
  // 무슨 쿠폰 받았는지 그린다.
  // 내가 무슨 쿠폰 받았는지 알아야 한다.
  // 현재 걸음 수, 쿠폰 받을 수 있는지 여부,
}


function stampAsClosed(targetTag, toShow) {
  if (toShow) {
    $(targetTag).find(".closed-coupon-bg").show();
    $(targetTag).find(".closed-coupon-stamp").show();
  } else {
    $(targetTag).find(".closed-coupon-bg").hide();
    $(targetTag).find(".closed-coupon-stamp").hide();
  }
}

function updateCoupons() {
  // dummies for test
  // var myEvents = [
  //   {
  //     startDtm: "20190131010203",
  //     mbrNo: 12,
  //     stpCnt: 12000,
  //   },
  //   {
  //     startDtm: "20190205030405",
  //     mbrNo: 12,
  //     stpCnt: 45000,
  //   },
  // ];
  // var issuedCoupons = [
  //   {
  //     'cpnNo': 1234,
  //     'cpnTyp': "discnt10000",
  //     'issueDtm': "20190131112233",
  //     'mbrNo': 12
  //   },
  //   {
  //     'cpnNo': 5678,
  //     'cpnTyp': "discnt40000",
  //     'issueDtm': "20190205223344",
  //     'mbrNo': 12
  //   }
  // ];
  // var allCoupons = [
  //   {
  //     'cpnNo': 123,
  //     'cpnTyp': "discnt4000",
  //     'mbrNo': null
  //   },
  //   {
  //     'cpnNo': 1234,
  //     'cpnTyp': "discnt10000",
  //     'mbrNo': 12
  //   },
  //   {
  //     'cpnNo': 12345,
  //     'cpnTyp': "coffee",
  //     'mbrNo': 556
  //   },
  //   {
  //     'cpnNo': 123456,
  //     'cpnTyp': "discnt40000",
  //     'mbrNo': null
  //   },
  //   {
  //     'cpnNo': 5678,
  //     'cpnTyp': "discnt40000",
  //     'mbrNo': 12
  //   },
  // ];

  if (!myEvents || myEvents.length === 0) {
    return;
  }

  // 1차의 stpCnt 보여주기 & 2차 보여주기
  $("#round-2").hide();
  if (myEvents.length < 2) {
    $("#stepCountFirst").text(myEvents[0].stpCnt);
  } else {
    $("#stepCountFirst").text(myEvents[0].stpCnt);
    $("#stepCountSecond").text(myEvents[1].stpCnt);
    $("#round-2").show();
  }

  var rounds = [1, 2];  // 차수
  var steps = [4000, 10000, 15000, 40000];  // 쿠폰 4가지 기준 steps
  for (var i = 0; i < myEvents.length; i++) {
    var topTag = "#coupon" + rounds[i] + "_";
    var stpCnt = myEvents[i].stpCnt;
    var startDate = myEvents[i].startDtm.substr(0, 8);

    for (var j = 0; j < steps.length; j++) {
      var targetTag = topTag + steps[j];
      // console.log(targetTag);
      var r = rounds[i];
      var baseSteps = steps[j];
      var cpnTyp = guagePoints[j].cpnTyp;

      var foundCoupon = issuedCoupons.find(function (item) {
        return item.issueDtm.substr(0, 8) === startDate && item.cpnTyp === cpnTyp;
      });
      // console.log("foundCoupon:", foundCoupon);

      // 기존에 걸려 있던 click listener 해제
      $(targetTag).unbind("click");

      // 보유한 쿠폰이 있으면 회색, 없으면 노란색
      if (foundCoupon) {
        $(targetTag).find(".coupon-yellow").hide();
        $(targetTag).find(".coupon-grey").show();
      } else {
        $(targetTag).find(".coupon-yellow").show();
        $(targetTag).find(".coupon-grey").hide();
        $(targetTag).on('click', function () {
          requestCoupon(baseSteps, cpnTyp);
          // console.log("requestCoupon: ", baseSteps, cpnTyp);
        });
      }

      // stpCnt에 따라 자물쇠 or V 표시
      if (stpCnt >= baseSteps) {
        $(targetTag).find(".coupon-unlocked").show();
        $(targetTag).find(".coupon-locked").hide();
      } else {
        $(targetTag).find(".coupon-unlocked").hide();
        $(targetTag).find(".coupon-locked").show();
        $(targetTag).find(".coupon-yellow").hide();
        $(targetTag).find(".coupon-grey").show();
        $(targetTag).unbind("click");
      }

      // 다 나간 쿠폰인지 확인하는 처리
      if (!foundCoupon) {
        var filteredCoupons = allCoupons.filter(function (item) {
          return !item.mbrNo && item.cpnTyp === cpnTyp;
        });
        // console.log(filteredCoupons);
        if (filteredCoupons.length === 0) {
          stampAsClosed(targetTag, true);
          $(targetTag).find(".coupon-yellow").hide();
          $(targetTag).find(".coupon-grey").show();
          $(targetTag).unbind("click");
        } else {
          stampAsClosed(targetTag, false);
        }
      } else {
        stampAsClosed(targetTag, false);
      }

      // console.log("%c-------------------------", "color: #ff0000;")
    }
  }
}

function displayJsonTable(id, colNames, obj) {
	return 0;
	var text = '';
	for(var i=-1;i<obj.length;i++)
    {
		text += '<div>'
        for(let j in colNames) {
        		var colName = colNames[j];
        		if(i==-1)
        			text += colName + '\t'
        		else {
        			if(colName=='rgstDtm')
        				text += yymmdd(obj[i][colName]) + '\t'
        			else 
        				text += obj[i][colName] + '\t'
        		}
        			
        }
        text += '</div>' 
    }   
    $(id).html(text);
}

function hideAllImg() {
	$('img').hide();
}

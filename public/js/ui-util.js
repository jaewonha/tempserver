var gIsMobile;

function scrollTo(id) {
	document.getElementById(id).scrollIntoView()	
}

function refresh() {
	location.reload();
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
  var guagePoints = [
    {
      steps: 4000,
      percent: 17.5
    },
    {
      steps: 10000,
      percent: 35.7
    },
    {
      steps: 15000,
      percent: 55
    },
    {
      steps: 40000,
      percent: 92
    },
    {
      steps: 40001,
      percent: 96.6
    }
  ];

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

var agreed = false;

$(document).ready(function () {

  function appFunctionPedometer() {
    location.href = "toapp:::AppFunction:::Pedometer";
  }

// START 클릭
  $("#btnApply-mobile").click(function () {
    // TODO: 기존에 동의 했는지 체크하는 부분 필요함
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
});

// for test
function updateSteps() {
  var steps = 39000;
  updateStepsUI(steps);
  updateProgress(steps);
  _startCountDown(new Date("2019-10-01 01:01:05"), new Date("2019-10-01 00:00:00"), "id");
}

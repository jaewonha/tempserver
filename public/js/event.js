//this value will be overrided when native webkit loads real values
var gMbrNo = "MBR00000000000001512";
var gEntNo = "ENT00000000000001181";
var gStrCd = "s00";
var gMbrNm;
var gMbrPhone;
var gMainBtn;

var issuedCoupons = [];
var myEvents = [];
var allCoupons = [];

function setMainButton(enabled, text) {
	$(gMainBtn).prop('disabled', !enabled);
	$(gMainBtn).text(text);
}

function setStpCnt(stpCnt) {
	stpCnt *= 100;
	console.log('setStpCnt:', stpCnt);
	console.log('gMbrNm:', gMbrNm);
	console.log('gMbrPhone:', gMbrPhone);
	console.log('gStrCd:', gStrCd);
	$('#stepCount').text(stpCnt);
}

function injectFromNative(entNo, mbrNo, mbrNm, mbrPhone, strCd) {
	gEntNo = entNo;
	gMbrNo = mbrNo;
	gStrCd = strCd;
	gMbrNm = mbrNm;
	gMbrPhone = mbrPhone;
	console.log('inject:', [gMbrNo, gEntNo, gStrCd, gMbrNm, gMbrPhone]);
	loadUserInfo();
}

function getStpCnt(stpCnt) {
	return $('#stepCount').text();
}

// for test
function addStpCnt(num) {
	var a = parseInt(getStpCnt());
	var b = a + num;
	setStpCnt(b);
}

function getCoupon() {
	var stpCnt = parseInt(getStpCnt());
	var successSteps = getSuccessSteps(stpCnt);
	var foundItem = guagePoints.find(function (item, index) {
		return successSteps === item.steps;
	});
	requestCoupon(successSteps, foundItem.cpnTyp);
}

function loadUserInfo () {
	$("#userName").text(gMbrNm);
	$("#userMbrNo").text(gMbrNo);
	$("#userEntId").text(gEntNo);
	$("#userStrCd").text(gStrCd);
}

function renderMobileOrPC() {
	if (isNativeMobile()) {
		$("#stepper").hide();
	} else {
		$("#stepper").show();
	}

	if(isMobile()) {
		console.log("isMobile------------------------")
		gMainBtn = '#btnApply-mobile';
		$('#btnApply-pc').hide();
		$('#agent').text('mobile');
		$("#for-debug-area").hide();

		// $("#header-top").removeClass("header-top-pc");
		// $("#header-top").addClass("header-top-mobile");
		$("#main-intro").removeClass("main-intro-pc");
		$("#main-intro").addClass("main-intro-mobile");
		$("#event-1-body").removeClass("event-1-body-pc");
		$("#event-1-body").addClass("event-1-body-mobile");
		$("#event-1-header").removeClass("event-1-header-pc");
		$("#event-1-header").addClass("event-1-header-mobile");
		$("#event-1-header-img-wrapper").removeClass("event-1-header-img-wrapper-pc");
		$("#event-1-header-img-wrapper").addClass("event-1-header-img-wrapper-mobile");
		$("#for-debug-area").show();

	} else {
		console.log("isMobile------------------------ NOT")
		if (!getUrlParameter('admin')) {
			$('#topThumbnail').hide();
			$("#stepper").hide();
			$("#for-debug-area").hide();
		}
		//pc test admin
		gMainBtn = '#btnApply-pc';
		$('#btnApply-mobile').hide(); 
		$('#couponThumb').hide();
		$('#agent').text('PC');
		$("#stepper").show();
		$("#for-debug-area").show();

		// $("#header-top").removeClass("header-top-mobile");
		// $("#header-top").addClass("header-top-pc");
		$("#main-intro").removeClass("main-intro-mobile");
		$("#main-intro").addClass("main-intro-pc");
		$("#event-1-body").removeClass("event-1-body-mobile");
		$("#event-1-body").addClass("event-1-body-pc");
		$("#event-1-header").removeClass("event-1-header-mobile");
		$("#event-1-header").addClass("event-1-header-pc");
		$("#event-1-header-img-wrapper").removeClass("event-1-header-img-wrapper-mobile");
		$("#event-1-header-img-wrapper").addClass("event-1-header-img-wrapper-pc");
	}
}


$(document).ready(function(){
	$("#got-my-events-count").bind("DOMSubtreeModified", function () {
	  console.log("got-my-events-count:::::::::::");
    updateCoupons();
		// if ($(this).val() === $("#got-received-coupons-count").val() === $("#got-all-coupons-count").val()) {
		// }
	});

	$("#got-received-coupons-count").bind("DOMSubtreeModified", function () {
    console.log("got-received-coupons-count:::::::::::");
    updateCoupons();
		// if ($(this).val() === $("#got-my-events-count").val() === $("#got-all-coupons-count").val()) {
		// }
	});

	$("#got-all-coupons-count").bind("DOMSubtreeModified", function () {
    console.log("got-all-coupons-count:::::::::::");
    updateCoupons();
		// if ($(this).val() === $("#got-my-events-count").val() === $("#got-received-coupons-count").val()) {
		// }
	});

	console.log('document.ready()');
	// console.log(isMobile())
	if(!isMobile()) _initialize();
});

<<<<<<< HEAD
function webviewLoadFinished() { //exact end of the webview load finished..
	if(isAndroid()) {
		console.log('webviewLoadFinished()');
		console.log('>>', Pedometer.isLogin(), Pedometer.getUserInfo()); //Pedometer == Webkit...
		_initialize();
=======
function webviewLoadFinished() {
	console.log('webviewLoadFinished()');
	if(isAndroid()) {
		console.log('>>', Pedometer.isLogin(), Pedometer.getUserInfo());
>>>>>>> 5ba1d9fbff51d0e23c9aa36e4f7af6122090a065
	}
	_initialize();
}

function _initialize() {
	//hideAllImg();

  //0. for display
  renderMobileOrPC(); //ui

  //1. admin
  loadUserInfo(); //for debug
  couponStatus();
  eventStatus();

  //2.
	console.log('onLoad:', typeof window.Pedometer !== undefined);
	if(isAndroid()) {
		if(Pedometer.isLogin()) { //user logged in
			var userInfo = Pedometer.getUserInfo();
			console.log('userInfo:', userInfo);
			var arr = userInfo.split(',');
			injectFromNative(arr[0], arr[1], arr[2], arr[3], arr[4]);
			$("#button-for-login").hide();
			$("#buttons").show();
		} else {
			$("#button-for-login").show();
			$("#buttons").hide();
		}
	}

	loadMyInfo();

	$("#curDate").text(yymmdd(getToday()));
	if(isEmptyStr(gMbrNm)&&false) {
		console.log('>>user info null -> not login');
		$("#stepCount").hide();
		$("#loginToSeeInfo").removeClass('hidden');
	}

	console.log('getToday():', getToday());

	// stepCount 업데이트시 UI 업데이트
	$("#stepCount").bind("DOMSubtreeModified", function () {
		var stpCnt = $(this).text();

		updateStepsUI(stpCnt);
		updateProgress(stpCnt);
		updateGettingCouponArea(stpCnt);
		updateCoupons();
	});

	setEventListners();
}

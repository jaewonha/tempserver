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
	stpCnt *= 1000;
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
		gMainBtn = '#btnApply-mobile';
		$('#btnApply-pc').hide();
		$('#agent').text('mobile');

		$("#header-top").removeClass("header-top-pc");
		$("#header-top").addClass("header-top-mobile");
		$("#main-intro").removeClass("main-intro-pc");
		$("#main-intro").addClass("main-intro-mobile");

	} else {
		if (!getUrlParameter('admin')) {
			$('#topThumbnail').hide();
			$("#stepper").hide();
		}
		//pc test admin
		gMainBtn = '#btnApply-pc';
		$('#btnApply-mobile').hide(); 
		$('#eventImgs').hide();
		$('#couponThumb').hide();
		$('#agent').text('PC');

		$("#header-top").removeClass("header-top-mobile");
		$("#header-top").addClass("header-top-pc");
		$("#main-intro").removeClass("main-intro-mobile");
		$("#main-intro").addClass("main-intro-pc");
	}
}


$(document).ready(function(){
	console.log('document.ready()');
	if(!isMobile()) initialize();
});

function webviewLoadFinished() {
	if(isAndroid()) {
		console.log('webviewLoadFinished()');
		console.log('>>', Pedometer.isLogin(), Pedometer.getUserInfo());
		initialize();
	}
}

function initialize() {
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
		if(Pedometer.isLogin()) {
			var userInfo = Pedometer.getUserInfo();
			console.log('userInfo:', userInfo);
			var arr = userInfo.split(',');
			injectFromNative(arr[0], arr[1], arr[2], arr[3], arr[4]);
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
	});

	$("#got-my-events-count").bind("DOMSubtreeModified", function () {
		if ($(this).val() === $("#got-received-coupons-count").val() === $("#got-all-coupons-count").val()) {
			updateCoupons();
		}
	});

	$("#got-received-coupons-count").bind("DOMSubtreeModified", function () {
		if ($(this).val() === $("#got-my-events-count").val() === $("#got-all-coupons-count").val()) {
			updateCoupons();
		}
	});

	$("#got-all-coupons-count").bind("DOMSubtreeModified", function () {
		if ($(this).val() === $("#got-my-events-count").val() === $("#got-received-coupons-count").val()) {
			updateCoupons();
		}
	});

	setEventListners();
	updateCoupons();
}


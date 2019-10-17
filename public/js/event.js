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
	console.log('setStpCnt:', stpCnt);
	console.log('gMbrNm:', gMbrNm);
	console.log('gMbrPhone:', gMbrPhone);
	console.log('gStrCd:', gStrCd);
	$('#stepCount').text(stpCnt);
}

function injectFromNative(entNo, mbrNo, mbrNm, mbrPhone, strCd) {
	gMbrNo = entNo;
	gEntNo = mbrNo;
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
		$("#for-debug-area").hide();

		$("#header-top").removeClass("header-top-pc");
		$("#header-top").addClass("header-top-mobile");
		$("#main-intro").removeClass("main-intro-pc");
		$("#main-intro").addClass("main-intro-mobile");
		$("#event-1-body").removeClass("event-1-body-pc");
		$("#event-1-body").addClass("event-1-body-mobile");
		$("#event-1-header").removeClass("event-1-header-pc");
		$("#event-1-header").addClass("event-1-header-mobile");
		$("#event-1-header-img-wrapper").removeClass("event-1-header-img-wrapper-pc");
		$("#event-1-header-img-wrapper").addClass("event-1-header-img-wrapper-mobile");

	} else {
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
		$("#for-debug-area").show();

		$("#header-top").removeClass("header-top-mobile");
		$("#header-top").addClass("header-top-pc");
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
  //0. for display
	renderMobileOrPC(); //ui

  //1. admin
	loadUserInfo(); //for debug
  couponStatus();
  eventStatus();

  //2.
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
});

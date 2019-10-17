//this value will be overrided when native webkit loads real values
var gMbrNo = "MBR00000000000001512";
var gEntNo = "ENT00000000000001181";
var gStrCd = "s00";
var gMainBtn;
	
function setMainButton(enabled, text) {
	$(gMainBtn).prop('disabled', !enabled);
	$(gMainBtn).text(text);
}

function setStpCnt(stpCnt) {
	console.log('setStpCnt:', stpCnt);
	$('#stepCount').text(stpCnt);
	$('#gauage').text(stpCnt/40000);
}

function getStpCnt(stpCnt) {
	return $('#stepCount').text();
}

function loadUserInfo () {
	$("#userName").text(gMbrNo);
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

<<<<<<< Updated upstream
	renderMobileOrPC();
	//api
	loadUserInfo();
=======
	renderMobileOrPC(); //ui
	loadUserInfo(); //below is api call
>>>>>>> Stashed changes
	couponStatus();
	eventStatus();
	loadMyInfo();
	$("#curDate").text(yymmdd(getToday()));

	console.log('getToday():', getToday());
});

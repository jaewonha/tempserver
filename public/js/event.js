//this value will be overrided when native webkit loads real values
var gMbrNo = "MBR00000000000001512";
var gEntNo = "ENT00000000000001181";
var gStrId = "s00";
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
	$("#userStrId").text(gStrId);
}

function renderMobileOrPC() {
	if(isMobile()) {
		gMainBtn = '#btnApply-mobile';
		$('#btnApply-pc').hide();
		$('#topThumbnail').show();
		$('#eventImgs').show();
		$('#agent').text('mobile');
	} else {
		gMainBtn = '#btnApply-pc';
		$('#btnApply-mobile').hide(); 

		$('#topThumbnail').hide();
		$('#eventImgs').hide();
		$('#agent').text('PC');
	}
}
$(document).ready(function(){

	renderMobileOrPC();
	//api
	loadUserInfo();
	couponStatus();
	eventStatus();
	loadMyInfo();
	$("#curDate").text(yymmdd(getToday()));

	console.log('getToday():', getToday());
});

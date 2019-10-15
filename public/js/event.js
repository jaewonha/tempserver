//this value will be overrided when native webkit loads real values
var gMbrNo = "MBR00000000000001512";
var gEntNo = "ENT00000000000001181";
var gStrId = "s00";
var gMainBtn;
var isMobile;
	
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
	gIsMobile = isMobile();
	if(gIsMobile) {
		gMainBtn = '#btnApply-mobile';
		$('#btnApply-pc').hide();
	} else {
		gMainBtn = '#btnApply-pc';
		$('#btnApply-mobile').hide(); 

		$('#topThumbnail').hide();
		$('#eventImgs').hide();
	}
}
$(document).ready(function(){

	renderMobileOrPC();
	loadUserInfo();
	couponStatus();
	eventStatus();
	loadMyInfo();

	console.log('getToday():', getToday());
});

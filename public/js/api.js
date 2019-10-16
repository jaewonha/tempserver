function getTokenVal() {
	return '12token34';
}

function API(endpoint, method, param, callback) {
	var BASE_URL='http://10.12.21.58:8080';

	var queryString = method=='get'  ? '?' + $.param(param)  : '';
	var bodyString  = method=='post' ? JSON.stringify(param) : null;
	
	console.log('Pedometer:API:' + [endpoint, queryString, bodyString]);
	fetch(BASE_URL+endpoint+queryString, 
	{
	  method: method,
	  headers: {
		'Access-Control-Allow-Origin': '*',
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
		'tknVal': getTokenVal()
	  },
	  body: bodyString
	}).then(res => res.json())
	  .then(res => callback(res));
}

function applyEvent() {
	let param = {
		"entNo":gEntNo,
		"mbrNo":gMbrNo,
		"strId":gStrId,
		"rgstDtm":getToday()
	}
	
	API('/pedometer/apply-event', 'post', param, (res) => {
		//var resStr = JSON.stringify(res); 
		//document.getElementById('history').innerText=resStr;
		let failed = res.result.includes('fail');
		if(failed) {
			alert('[failed]' + res.result)
		} else {
			//alert('이벤트에 지원하였습니다');
			//kickPedometerUpdaet(param.rgstDtm);
			alert('이벤트에 지원하였습니다:injectIntoApp:param.rgstDtm:' + param.rgstDtm);
			if(isIOS())
			 	webkit.messageHandlers.injectIntoApp.postMessage(param);

			refresh();
		}
	});	 	
}

function requestCoupon(stpCnt, cpnTyp) {
	if(!isMobile()){
		setStpCnt(stpCnt); //test : pc에서는 setStep ui로 직접 입력하게 바꿀 것
	}
	stpCnt = getStpCnt();
	
	let param = {
		"entNo":gEntNo,
		"mbrNo":gMbrNo,
		"strId":gStrId,
		"rgstDtm":getToday(),
		"stpCnt":stpCnt,
		"cpnTyp":cpnTyp
	}
	
	API('/pedometer/request-coupon', 'post', param, (res) => {
		var resStr = JSON.stringify(res); 
		//document.getElementById('history').innerText=resStr;
		let failed = res.result.includes('fail');
		if(failed) {
			alert('[failed]' + res.result)
		} else {
			alert('쿠폰 [' + cpnTyp + '/' +stpCnt + '] 지원:' + resStr);
			refresh(); 
		}
	});	 	
}

function clearMyEvent() {
	let param = {
		"entNo":gEntNo,
		"mbrNo":gMbrNo,
	}
	
	API('/pedometer/clear-my-events', 'post', param, (res) => {
		refresh(); 
	});	 	
}

function clearMyCoupon() {
	let param = {
		"entNo":gEntNo,
		"mbrNo":gMbrNo,
	}
	
	API('/pedometer/clear-my-coupons', 'post', param, (res) => {
		refresh(); 
	});	 	
}

function eventStatus() {
	API('/pedometer/event-status', 'get', {
		"mbrNo":gMbrNo,
		"entNo":gEntNo
	}, (res) => {
		//var resStr = JSON.stringify(res, null, 2); 
		//$('#couponStatus').text(resStr);
		displayJsonTable('#eventStatus', ['entNo','rgstDtm','mbrNo', 'stpCnt'], res.result);
	});	
}

function couponStatus() {
	API('/pedometer/coupon-status', 'get', {
		"mbrNo":gMbrNo,
		"entNo":gEntNo
	}, (res) => {
		//var resStr = JSON.stringify(res, null, 2); 
		//$('#couponStatus').text(resStr);
		displayJsonTable('#couponStatus', ['cpnId','cpnTyp','mbrNo'], res.result);
	});	
}

function finalizeSteps() {
	let stpCnt = $('#stepCount').text();
	let param = {
		"entNo":gEntNo,
		"mbrNo":gMbrNo,
		"rgstDtm":getToday(),
		"stpCnt": stpCnt,
	}
		
	API('/pedometer/update-final-steps', 'post', param, (res) => {
		var resStr = JSON.stringify(res); 
		//document.getElementById('history').innerText=resStr;
		let failed = res.result.includes('fail');
		if(failed) {
			alert('[failed]' + res.result)
		} else {
			alert('만보기 이벤트 참여 끝:' + resStr);
			refresh(); 
		}
	});	 	
}

function loadMyInfo() {
	API('/pedometer/my-received-coupons', 'get', {
		"mbrNo":gMbrNo,
		"entNo":gEntNo
	}, (res) => {
		displayJsonTable('#myCoupons', ['cpnId', 'cpnTyp', 'rgstDtm', 'mbrNo'], res.issuedCoupons);
	});	 	
	
	API('/pedometer/my-event', 'get', {
		"mbrNo":gMbrNo,
		"entNo":gEntNo,
		"rgstDtm":getToday()
	}, (res) => {
		var applicableStatus = res.applicableStatus;
		var participatingEvent = res.participatingEvent;
		/*
			public static final String TODAY_PARTICIPATING = "todayParticipating";
			public static final String TODAY_FINISHED = "todayFinishded";
			public static final String APP_PARTICIPATED = "allParticipated";
			public static final String NOT_PEDOMETER_EVENT = "notPedometerEvent";
			public static final String APPLICABLE = "applicable";
		*/	
		console.log('my-event:',res);
		//alert('my-event:' + JSON.stringify(res));
		
		if(applicableStatus=='applicable') {
			setMainButton(true, '이벤트 지원하기'); 
			$("#curEventInfo").hide();
		} else if (applicableStatus==('todayParticipating')) {
			setMainButton(false, '이벤트가 진행중입니다'); 
			$("#curEventInfo").show();
			startCountDown(participatingEvent.rgstDtm, '#timeCounter');
		} else if (applicableStatus==('todayFinishded')) {
			setMainButton(false, '오늘 이벤트에 참여하셨습니다'); 
			$("#curEventInfo").hide();
		} 
		else if(applicableStatus==('allParticipated')) {
			setMainButton(false, '이벤트에 모두 참여하셨습니다'); 
			$("#curEventInfo").hide();
		} else {
			alert('알 수 없는 오류:applicableStatus:' + applicableStatus)
		}

		$('#attendCount').text(res.myPedometerEvent.length);
		//var resStr = JSON.stringify(res.myPedometerEvent, null, 2);
		//document.getElementById('history').innerText = resStr;
		displayJsonTable('#history', ['rgstDtm', 'mbrNo', 'stpCnt'], res.myPedometerEvent);
	});	 	
}

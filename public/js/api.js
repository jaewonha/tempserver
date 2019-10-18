function getTokenVal() {
	return '12token34';
}

function API(endpoint, method, param, callback) {
	//var BASE_URL='http://10.12.21.58:8080';
	//var BASE_URL='http://10.44.1.14:8110';
	var BASE_URL=''

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
		.then(res => {
			console.log("%cEndPoint: " + endpoint + " | res: " + JSON.stringify(res), "color: lightblue;");
			return res;
		})
	  .then(res => callback(res))
	  .catch(e=> console.log('api error:', e));
}

function applyEvent() {
	let param = {
		"entNo":gEntNo,
		"mbrNo":gMbrNo,
		"strCd":gStrCd, //native injection
		"startDtm":getToday()
	}

	API('/pedometer/apply-event', 'post', param, (res) => {
		//var resStr = JSON.stringify(res); 
		//document.getElementById('history').innerText=resStr;
		console.log('>>>####', res);
		let failed = res.result.includes('fail');
		if(failed) {
			alert('[failed]' + res.result)
		} else {
			//alert('이벤트에 지원하였습니다');
			//kickPedometerUpdaet(param.startDtm);
			alert('이벤트에 지원하였습니다:injectIntoApp:param.startDtm:' + param.startDtm);

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
		"strCd":gStrCd,
		"issueDtm":getToday(),
		"stpCnt":stpCnt,
		"cpnTyp":cpnTyp
	}
	
	API('/pedometer/request-coupon', 'post', param, (res) => {
		var resStr = JSON.stringify(res);
		//document.getElementById('history').innerText=resStr;
		let failed = res.result.includes('fail');
		if(failed) {
			console.log("failed", failed)
			alert('[failed]' + res.result)
		} else {
			let issuedCoupon = res.issuedCoupon;
			//alert('쿠폰 [' + cpnTyp + '/' +stpCnt + '] 지원:' + resStr);
			console.log("1", issuedCoupon)
			alert('쿠폰을 발급하였습니다(No:'+issuedCoupon.cpnNo+').\n 쿠폰함에서 확인하세요');
			console.log("2")
			if(isAndroid()) Pedometer.registerCoupon(issuedCoupon.cpnNo);
			console.log("3")
			refresh();
			console.log("4")
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
	API('/pedometer/admin/event-status', 'get', {
		"mbrNo":gMbrNo,
		"entNo":gEntNo
	}, (res) => {
		//var resStr = JSON.stringify(res, null, 2); 
		//$('#couponStatus').text(resStr);
		displayJsonTable('#eventStatus', ['entNo','startDtm','mbrNo', 'stpCnt'], res.result);
	});	
}

function couponStatus() {
	API('/pedometer/admin/coupon-status', 'get', {
		"mbrNo":gMbrNo,  // member number
		"entNo":gEntNo   // event number
	}, (res) => {
		//var resStr = JSON.stringify(res, null, 2); 
		//$('#couponStatus').text(resStr);
		displayJsonTable('#couponStatus', ['cpnNo','cpnTyp','mbrNo'], res.result);
		allCoupons = res.result;
		var cnt = parseInt($("#got-all-coupons-count").val()) + 1;
		$("#got-all-coupons-count").val(cnt);
		updateCoupons();
	});
}

function finalizeSteps() {
	let stpCnt = $('#stepCount').text();
	let param = {
		"entNo":gEntNo,
		"mbrNo":gMbrNo,
		"endDtm":getToday(),
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
		if (res.issuedCoupons.length > 0) {
			$("#button-coupon-check-disabled").hide();
			$("#button-coupon-check").show();
		} else {
			$("#button-coupon-check-disabled").hide();
			$("#button-coupon-check").show();
		}
		displayJsonTable('#myCoupons', ['cpnNo', 'cpnTyp', 'issueDtm', 'mbrNo'], res.issuedCoupons);

		var cnt = parseInt($("#got-received-coupons-count").text()) + 1;
		$("#got-received-coupons-count").text(cnt);
		// updateCoupons(res.issuedCoupons);

		issuedCoupons = res.issuedCoupons;
		updateCoupons();
	});
	
	API('/pedometer/my-event', 'get', {
		"mbrNo":gMbrNo,
		"entNo":gEntNo,
		"startDtm":getToday() //중복 조회 쿼리하기 위해 (내 정보 조회 후 어플라이 가정)
	}, (res) => {
		var applicableStatus = res.applicableStatus;
		/*
			public static final String TODAY_PARTICIPATING = "todayParticipating";
			public static final String TODAY_FINISHED = "todayFinishded";
			public static final String APP_PARTICIPATED = "allParticipated";
			public static final String NOT_PEDOMETER_EVENT = "notPedometerEvent";
			public static final String APPLICABLE = "applicable";
		*/
		var participatingEvent = res.participatingEvent;
		console.log('my-event:',res);
		// alert('my-event:' + JSON.stringify(res));

		if(applicableStatus=='applicable') {
			// setMainButton(true, '이벤트 지원하기');

			$("#button-start").show();
			$("#button-ing").hide();
			$("#button-done").hide();

			$("#curEventInfo").hide();

		} else if (applicableStatus==('todayParticipating')) {
			// setMainButton(false, '이벤트 진행중입니다');

			$("#button-start").hide();
			$("#button-ing").show();
			$("#button-done").hide();

			$("#curEventInfo").show();
			startCountDown(participatingEvent.startDtm, '#timeCounter'); //getTime () ~ 24hours
			setStepStartDate(participatingEvent.startDtm);

		} else if (applicableStatus==('todayFinishded')) {
			// setMainButton(false, '오늘 이벤트에 참여하셨습니다');

			$("#button-start").show();
			$("#button-ing").hide();
			$("#button-done").hide();

			$("#curEventInfo").hide();

		} else if(applicableStatus==('allParticipated')) {
			// setMainButton(false, '이벤트에 모두 참여하셨습니다');

			$("#button-start").hide();
			$("#button-ing").hide();
			$("#button-done").show();

			$("#curEventInfo").hide();

		} else {
			alert('알 수 없는 오류:applicableStatus:' + applicableStatus)
		}

		var myEventsSorted = res.myPedometerEvent.sort(function (a, b) {
			return a.startDtm < b.startDtm ? -1 : a.startDtm > b.startDtm ? 1 : 0;
		});

		$('#attendCount').text(myEventsSorted.length); //참여횟수

		if (myEventsSorted.length < 2) {
			$("#round-2").hide();
		} else {
			$("#round-2").show();
		}
		//var resStr = JSON.stringify(myEventsSorted, null, 2);
		//document.getElementById('history').innerText = resStr;
		displayJsonTable('#history', ['startDtm', 'mbrNo', 'stpCnt'], myEventsSorted);

		var cnt = parseInt($("#got-my-events-count").text()) + 1;
		$("#got-my-events-count").text(cnt);

		myEvents = myEventsSorted;
	});
}

function setStepStartDate(date) {
	console.log('setStepStartDate(' + date + ')');
	if(isAndroid()) Pedometer.setStepStartDate(date);
}


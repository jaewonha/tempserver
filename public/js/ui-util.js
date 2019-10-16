var gIsMobile;

function scrollTo(id) {
	document.getElementById(id).scrollIntoView()	
}

function refresh() {
	location.reload();
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
  var timer = setInterval(function() {
    var distance = endDate - date;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    //$(id).text(days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
	if(seconds<10) seconds = '0' + seconds;
    $(id).text(hours + ":" + minutes + ":" + seconds + "");

    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(timer);
    	$(id).text('EXPIRED');
    }
	date.setSeconds(date.getSeconds() + 1);
  }, 1000);
  return timer;
}

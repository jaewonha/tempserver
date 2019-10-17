Date.prototype.hhmmss = function() {
  var hh = this.getHours();
  var mm = this.getMinutes();
  var ss = this.getSeconds();

  return [(hh>9 ? '' : '0') + hh,
          (mm>9 ? '' : '0') + mm,
          (ss>9 ? '' : '0') + ss,
         ].join('');
};

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

Date.prototype.yyyymmddhhmmss = function() {
  return this.yyyymmdd() + this.hhmmss();
};

var addDayAmount = 0;  	
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result; 
}

function getAddDay() {
	var _addDay = getUrlParameter('addDay');
	return (typeof _addDay !== "undefined") ? _addDay*1 : 0;
}

function getToday() {
	var _addDay = getUrlParameter('addDay');
	var date = typeof _addDay !== "undefined" ?
			addDays(new Date(), _addDay*1) : new Date();
	return date.yyyymmddhhmmss();
}

function yymmdd(date) {
	return date.substr(2,2) + '년' + date.substr(4,2) + '월' + date.substr(6,2) + '';
}

function parseDtmStrtoDate(DtmStr) {
	var date = new Date(DtmStr.replace(
		/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
		'$4:$5:$6 $2/$3/$1'
	));
	return date;
}

function lastTimeOfTheDay(date) {
  var lastTime = "" +
    date.getFullYear() + "-" +
    (date.getMonth() + 1) + "-" +
    date.getDate() + " 23:59:59";
  // console.log(lastTime)
  return new Date(lastTime);
}


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function isEmptyStr(_var) {
	return _var==null || _var=='';
}

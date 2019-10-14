
function getEventType() {
	return "Lotte40th";
}

function startStepCounter() {
	//setInterval( function() {
		console.log('update stepcounter...');
		if(window.Android) {
			var steps = window.Android.querySteps("aaa123");
			document.getElementById("stepCount").innerHTML = steps;
		} else {
			document.getElementById("stepCount").innerHTML = "no android callback";
		}
	//}, 1000);
}

function getMbrId() {
	return "m01"
}

function getStepCount() {
	return 3000;
}

function API(endpoint, method, param, callback) {
	var BASE_URL='http://localhost:8080/pedometer';

	fetch(BASE_URL+endpoint, {
	  method: method,
	  headers: {
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify(param)
	}).then(res=>res.json())
	  .then(res => callback(res));
}

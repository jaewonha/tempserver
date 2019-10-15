var gIsMobile;

function scrollTo(id) {
	document.getElementById(id).scrollIntoView()	
}

function refresh() {
	location.reload();
}

function isMobile() {
	var filter = "win16|win32|win64|mac|macintel"; 
	if ( navigator.platform ) { 
		if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 && false) 
		{ 
			return true;
		} 
		else
		{ 
			return false;
		} 
	}
	return true;
}

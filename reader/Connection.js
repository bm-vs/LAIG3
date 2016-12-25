function makeRequest(request_string)
{	
	// Make Request
	var request = getPrologRequest(request_string, handleReply);
	return request;
}

function getPrologRequest(requestString, onSuccess, onError, port)
{
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);

	//console.log(requestString);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();

	return request;
}

//Handle the Reply
function handleReply(data){
	return data.target.response;
}

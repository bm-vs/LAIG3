function xor(a, b) {
	return ((a && !b) || (!a && b));
}

// Get string of array of integers and return that array
function processString(string) {
	if (string.length == 2) {
		return [];
	}

	var str1 = string.slice(1, string.length-1);

	var array = str1.split(',').map(function(item) {
		return parseInt(item, 10);
	});

	return array;
}

// Print formatted 2d array to console
function print2dArray(arr) {
	var arrText='';

	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			arrText+=arr[i][j]+' ';
		}
		console.log(arrText);
		arrText='';
	}
}
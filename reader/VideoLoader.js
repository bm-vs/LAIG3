function VideoLoader(filename, scene) {
	this.scene = scene;
	this.reader = new CGFXMLreader();
	this.reader.open('videos/'+filename, this);
}

VideoLoader.prototype.onXMLReady = function() {
	var rootElement = this.reader.xmlDoc.documentElement;
	var error = this.parseDSX(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.scene.videoState.loadedOk = true;
}

VideoLoader.prototype.onXMLError = function(message) {
	this.loadedOk=false;
	location.href = "index.html";
}

VideoLoader.prototype.parseDSX = function(rootElement) {
	var video_moves = [];

	var moves = rootElement.getElementsByTagName("move");
	for (var i = 0; i < moves.length; i++) {
		var from_x = null; var from_y = null; var to_x = null; var to_y = null; var jumped_to_x = null; var jumped_to_y = null; var move = null;
		from_x = this.reader.getInteger(moves[i],"from_x",true);
		from_y = this.reader.getInteger(moves[i],"from_y",true);
		to_x = this.reader.getInteger(moves[i],"to_x",true);
		to_y = this.reader.getInteger(moves[i],"to_y",true);
		
		if (this.reader.hasAttribute(moves[i], "jumped_to_x") && this.reader.hasAttribute(moves[i], "jumped_to_y")){
			jumped_to_x = this.reader.getInteger(moves[i],"jumped_to_x",true);
			jumped_to_y = this.reader.getInteger(moves[i],"jumped_to_y",true);
			
			var move = new VideoMove(this.scene, from_x, from_y, to_x, to_y, jumped_to_x, jumped_to_y);
		}
		else {
			var move = new VideoMove(this.scene, from_x, from_y, to_x, to_y);
		}
		
		video_moves.push(move);
	}

	this.scene.videoState.moves = video_moves;
}
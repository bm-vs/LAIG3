function VideoInterface() {
	CGFinterface.call(this);
}

VideoInterface.prototype = Object.create(CGFinterface.prototype);
VideoInterface.prototype.constructor = VideoInterface;

VideoInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);

	return true;
}


VideoInterface.prototype.processKeyboard = function(event) {
	CGFinterface.prototype.processKeyboard.call(this,event);

	switch(event.keyCode) {
		// C/c
		case(67):
		case(99):
			this.scene.changeCamera();
			break;
			
		// X/x
		case(88):
		case(120):
			this.scene.startPause();
			break;
		
	}
}


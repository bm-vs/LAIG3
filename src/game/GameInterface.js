function GameInterface() {
	CGFinterface.call(this);
}

GameInterface.prototype = Object.create(CGFinterface.prototype);
GameInterface.prototype.constructor = GameInterface;

GameInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);

	return true;
}


GameInterface.prototype.processKeyboard = function(event) {
	CGFinterface.prototype.processKeyboard.call(this,event);

	switch(event.keyCode) {
		// C/c
		case(67):
		case(99):
			this.scene.changeCamera();
			break;

		// T/t
		case(84):
		case(116):
			// change texture
			break;
	}
}


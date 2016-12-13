function GameScene() {
	CGFscene.call(this);
	this.interface;
}

GameScene.prototype = Object.create(CGFscene.prototype);
GameScene.prototype.constructor = GameScene;

GameScene.prototype.init = function (application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();
	this.initLights();

	// Scene Setup	
	this.gl.clearColor(0.800, 0.900, 1.00, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.enableTextures(true);
	this.setPickEnabled(true);
	this.axis=new CGFaxis(this);
	this.setUpdatePeriod(100);

	// Create game state
	this.gameState = new GameState(this);
};


GameScene.prototype.initCameras = function () {
	this.cameras = [];
	this.cameras[0] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 28, 0.1), vec3.fromValues(0, 0, 0));
	this.cameras[1] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 25, 15), vec3.fromValues(0, 0, 0));
	this.cameras[2] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(10, 15, 20), vec3.fromValues(0, 0, 0));
	this.camera = this.cameras[0];
	this.interface.setActiveCamera(this.camera);

	this.activeCamera = 0;
};

GameScene.prototype.initLights = function() {
	this.lights[0].setPosition(0, 15, 0, 1);
	this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
	this.lights[0].setVisible(false);
	this.lights[0].enable();
	this.lights[0].update();
}

GameScene.prototype.setDefaultAppearance = function () {
	this.setAmbient(0.2, 0.4, 0.8, 1.0);
	this.setDiffuse(0.2, 0.4, 0.8, 1.0);
	this.setSpecular(0.2, 0.4, 0.8, 1.0);
	this.setShininess(10.0);	
};

GameScene.prototype.logPicking = function () {
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj) {
					this.gameState.processPick(obj);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

GameScene.prototype.display = function () {
	this.logPicking();
	this.clearPickRegistration();

	// Background, camera and axis setup
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.updateProjectionMatrix();
	this.loadIdentity();
	this.applyViewMatrix();
	this.axis.display();
	this.setDefaultAppearance();
	
	// GameState display
	this.gameState.display();
};


GameScene.prototype.changeCamera = function() {
	this.activeCamera = (this.activeCamera + 1) % this.cameras.length;
	this.camera = this.cameras[this.activeCamera];
	this.interface.setActiveCamera(this.camera);
}




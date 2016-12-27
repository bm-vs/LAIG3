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
	this.setUpdatePeriod(10);

	// Create game state
	this.gameState = new GameState(this);
};


GameScene.prototype.initCameras = function () {
	this.cameras = [];
	this.cameras[0] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 40, 0.1), vec3.fromValues(0, 0, 0));
	this.cameras[1] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 30, 30), vec3.fromValues(0, 0, 0));
	this.cameras[2] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 0), vec3.fromValues(0, 0, 0));
	this.cameras[3] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 30, -30), vec3.fromValues(0, 0, 0));
	this.cameras[4] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-30, 30, 0), vec3.fromValues(0, 0, 0));
	this.cameras[5] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 30, 30), vec3.fromValues(0, 0, 0));
	this.camera = this.cameras[0];
	//this.interface.setActiveCamera(this.camera);

	this.active_camera = 0;
	this.changing_camera = false;
	this.camera_animation = null;
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
	if (this.pickMode == false && !this.changing_camera && !this.gameState.ended) {
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

GameScene.prototype.changeCamera = function() {
	if (!this.changing_camera) {
		var next_camera = (this.active_camera + 1) % this.cameras.length;
	
		this.changing_camera = true;
		this.camera_animation = new AnimationCamera(this, this.cameras[this.active_camera], this.cameras[next_camera]);
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
	//this.axis.display();
	this.setDefaultAppearance();
	
	// GameState display
	this.gameState.display();
};

GameScene.prototype.update = function() {
	if (this.changing_camera && this.camera_animation != null) {
		this.camera_animation.update();
	}
	
	if (!this.gameState.ended) {
		this.gameState.update();
	}
}

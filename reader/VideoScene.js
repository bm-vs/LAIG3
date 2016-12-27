function VideoScene() {
	CGFscene.call(this);
	this.interface;
}

VideoScene.prototype = Object.create(CGFscene.prototype);
VideoScene.prototype.constructor = VideoScene;

VideoScene.prototype.init = function (application) {
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
	this.setUpdatePeriod(10);
	
	this.stop = false;
	
	// Create video state
	this.videoState = new VideoState(this);
};


VideoScene.prototype.initCameras = function () {
	this.cameras = [];
	this.cameras[0] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 40, 0.1), vec3.fromValues(0, 0, 0));
	this.cameras[1] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 30, 30), vec3.fromValues(0, 0, 0));
	this.cameras[2] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 0), vec3.fromValues(0, 0, 0));
	this.cameras[3] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 30, -30), vec3.fromValues(0, 0, 0));
	this.cameras[4] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-30, 30, 0), vec3.fromValues(0, 0, 0));
	this.cameras[5] = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 30, 30), vec3.fromValues(0, 0, 0));
	this.camera = this.cameras[0];

	this.active_camera = 0;
	this.changing_camera = false;
	this.camera_animation = null;
};

VideoScene.prototype.initLights = function() {
	this.lights[0].setPosition(0, 15, 0, 1);
	this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
	this.lights[0].setVisible(false);
	this.lights[0].enable();
	this.lights[0].update();
}

VideoScene.prototype.setDefaultAppearance = function () {
	this.setAmbient(0.2, 0.4, 0.8, 1.0);
	this.setDiffuse(0.2, 0.4, 0.8, 1.0);
	this.setSpecular(0.2, 0.4, 0.8, 1.0);
	this.setShininess(10.0);	
};

VideoScene.prototype.changeCamera = function() {
	if (!this.changing_camera) {
		var next_camera = (this.active_camera + 1) % this.cameras.length;
	
		this.changing_camera = true;
		this.camera_animation = new AnimationCamera(this, this.cameras[this.active_camera], this.cameras[next_camera]);
	}
}

VideoScene.prototype.display = function() {
	// Background, camera and axis setup
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.updateProjectionMatrix();
	this.loadIdentity();
	this.applyViewMatrix();
	this.setDefaultAppearance();
	
	// GameState display
	if (this.videoState.loadedOk) {
		this.videoState.display();
	}
};

VideoScene.prototype.startPause = function() {
	if (this.stop) {
		this.stop = false;
	}
	else {
		this.stop = true;
	}
}

VideoScene.prototype.update = function() {
	if (this.changing_camera && this.camera_animation != null) {
		this.camera_animation.update();
	}
	
	if (this.videoState.loadedOk && !this.videoState.ended && !this.stop) {
		this.videoState.update();
	}
}
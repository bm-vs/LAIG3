function AnimationCamera(scene, start_camera, end_camera) {
	this.scene = scene;
	this.duration = 1;
	this.start_camera = start_camera;
	this.end_camera = end_camera;
	this.curr_time = 0;
	this.next_camera = (this.scene.active_camera + 1) % this.scene.cameras.length;
}

AnimationCamera.prototype.update = function() {
	this.curr_time += this.scene.updatePeriod/1000;

	// Change camera when current animation time is equal to duration
	if (this.curr_time >= this.duration) {
		this.scene.active_camera = this.next_camera;
		this.scene.camera = this.scene.cameras[this.scene.active_camera];
		//this.scene.interface.setActiveCamera(this.scene.camera);
		this.scene.changing_camera = false;
		this.scene.camera_animation = null;
	}
	else {
		var x = this.start_camera.position[0] + ((this.end_camera.position[0] - this.start_camera.position[0])/this.duration * this.curr_time);
		var y = this.start_camera.position[1] + ((this.end_camera.position[1] - this.start_camera.position[1])/this.duration * this.curr_time);
		var z = this.start_camera.position[2] + ((this.end_camera.position[2] - this.start_camera.position[2])/this.duration * this.curr_time);
		
		this.scene.camera = new CGFcamera(this.start_camera.fov, this.start_camera.near, this.start_camera.far, vec3.fromValues(x, y, z), this.start_camera.target);
	}
}
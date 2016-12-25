function AnimationCamera(scene, start_camera, end_camera, duration) {
	this.duration = duration;
	this.start_pos = start_camera;
	this.end_pos = end_camera;
	this.curr_time = 0;
}
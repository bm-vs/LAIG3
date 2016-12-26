function Box(scene) {
	this.scene = scene;
    this.base = new Cube(this.scene);
	this.side = new Cube(this.scene);
	
	this.base_height = 0.06;
	this.base_z = this.base_height/8;
	this.base_width = 0.15;
	this.base_length = 1;
}

Box.prototype.display= function() {
	this.scene.pushMatrix();
		this.scene.translate(0, 0, -this.base_z);
		this.scene.scale(this.base_width, this.base_length, this.base_height);
		this.base.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(this.base_width/2-this.base_height/2, 0, this.base_height-this.base_z);
		this.scene.scale(this.base_height, this.base_length, this.base_height);
		this.side.display();
	this.scene.popMatrix();
}
function Box(scene) {
	this.scene = scene;
    this.base = new Cube(this.scene);
	this.side = new Cube(this.scene);
}

Box.prototype.display= function() {
	this.scene.pushMatrix();
		this.scene.translate(0, 0, -0.01875);
		this.scene.scale(0.15, 1, 0.0375);
		this.base.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(-0.05625, 0, 0.01875);
		this.scene.scale(0.0375, 1, 0.0375);
		this.side.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0.05625, 0, 0.01875);
		this.scene.scale(0.0375, 1, 0.0375);
		this.side.display();
	this.scene.popMatrix();
}
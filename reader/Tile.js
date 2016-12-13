function Tile(scene, id, x, y, selected) {
	this.scene = scene;
	this.id = id;
	this.x = x;
	this.y = y;
	this.selected = selected
	this.tile = new Plane(scene, 0.1, 0.1, 1, 1);
	this.appearance = new CGFappearance(scene);
	if (selected) {
		this.appearance.setAmbient(0.0, 0.3,0.0, 0.01);
		this.appearance.setDiffuse(0.0, 0.3, 0.0, 0.01);
		this.appearance.setSpecular(0.0, 0.3, 0.0, 0.01);
		this.appearance.setEmission(0.0, 0.3, 0.0, 0.01);
	}
	else {
		this.appearance.setAmbient(0.0, 0.0, 0.0, 0.01);
		this.appearance.setDiffuse(0.0, 0.0, 0.0, 0.01);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 0.01);
		this.appearance.setEmission(0.0, 0.0, 0.0, 0.01);
	}
}

Tile.prototype.display = function() {
	this.scene.gl.enable(this.scene.gl.BLEND);
	this.scene.gl.blendFunc(this.scene.gl.ONE, this.scene.gl.ONE);

	this.scene.pushMatrix();
		this.appearance.apply();
		this.scene.translate(this.x, this.y, 0.00001);
		this.scene.registerForPick(this.id, this);
		this.tile.display();
	this.scene.popMatrix();

	this.scene.gl.disable(this.scene.gl.BLEND);
}

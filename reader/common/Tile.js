function Tile(scene, id, x, y, selected) {
	this.scene = scene;
	this.id = id;
	this.x = x;
	this.y = y;
	this.selected = selected;
	this.tile = new Plane(scene, 0.1, 0.1, 1, 1);
	this.app_normal = new CGFappearance(scene);
	this.app_normal.setAmbient(0.0, 0.0, 0.0, 0.01);
	this.app_normal.setDiffuse(0.0, 0.0, 0.0, 0.01);
	this.app_normal.setSpecular(0.0, 0.0, 0.0, 0.01);
	this.app_normal.setEmission(0.0, 0.0, 0.0, 0.01);
	
	this.app_selected = new CGFappearance(scene);
	this.app_selected.setAmbient(0.0, 0.25, 0.0, 0.01);
	this.app_selected.setDiffuse(0.0, 0.25, 0.0, 0.01);
	this.app_selected.setSpecular(0.0, 0.25, 0.0, 0.01);
	this.app_selected.setEmission(0.0, 0.25, 0.0, 0.01);
}

Tile.prototype.display = function() {
	this.scene.gl.enable(this.scene.gl.BLEND);
	this.scene.gl.blendFunc(this.scene.gl.ONE, this.scene.gl.ONE);

	this.scene.pushMatrix();
		if (this.selected) {
			this.app_selected.apply();
		}
		else {
			this.app_normal.apply();
		}
		this.scene.translate(this.x/10, this.y/10, 0.001);
		this.scene.registerForPick(this.id, this);
		this.tile.display();
	this.scene.popMatrix();

	this.scene.gl.disable(this.scene.gl.BLEND);
}

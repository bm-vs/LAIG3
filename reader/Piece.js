function Piece(scene, id, x, y) {
	this.scene = scene;
	this.id = id;
	this.x = x;
	this.y = y;
	this.piece = new Cylinder(scene, 0.42, 0.42, 32, 8, 0.17);
	this.appearance = new CGFappearance(scene);

	
	if (xor(this.x % 2 == 0, this.y % 2 == 0)) {
		this.appearance.setAmbient(0.1, 0.1, 0.1, 1.0);
		this.appearance.setDiffuse(0.1, 0.1, 0.1, 1.0);
		this.player = 1;
	}
	else {
		this.appearance.setAmbient(1.0, 1.0, 1.0, 1.0);
		this.appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.player = 2;
	}
}

Piece.prototype.display = function() {
	this.scene.pushMatrix();
		this.appearance.apply();
		this.scene.translate(this.x, this.y, 0.4);
		this.scene.registerForPick(this.id, this);
		this.piece.display();
	this.scene.popMatrix();
}

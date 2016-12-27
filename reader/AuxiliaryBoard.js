function AuxiliaryBoard(scene, player) {
	this.scene = scene;
	this.player = player;

	this.box = new Box(this.scene);
	
	this.material = new CGFappearance(this.scene);
	this.material.loadTexture('resources/wood.jpg');
	
	this.current_y = 0;
	this.change = 0.2;
}

AuxiliaryBoard.prototype.display = function() {
	this.scene.pushMatrix();
		this.material.apply();
		this.box.display();
	this.scene.popMatrix();
}

AuxiliaryBoard.prototype.addPiece = function() {
	this.current_y += this.change;
}

AuxiliaryBoard.prototype.removePiece = function() {
	this.current_y -= this.change;
}
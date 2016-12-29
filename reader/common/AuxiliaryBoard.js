function AuxiliaryBoard(scene, player) {
	this.scene = scene;
	this.player = player;
	this.type = localStorage.theme;

	if (this.type == 1) {
		this.box = new Box(this.scene);
		this.material = new CGFappearance(this.scene);
		this.material.loadTexture('../resources/wood.jpg');
		if (this.player == 1) {
			this.current_x = 11.5;
		}
		else if (this.player == 2) {
			this.current_x = -2.5;
		}
		
		this.change = 0.188;
		this.current_y = 0;
	}
	else if (this.type == 2) {
		this.origin = 4.5;
		this.current_ang = 0;
		this.radius = 8;
		this.count = 0;
		
		if (this.player == 1) {
			this.current_x = this.origin + this.radius;
			this.p = 1;
		}
		else if (this.player == 2) {
			this.current_x = this.origin - this.radius;
			this.p = -1;
		}
		
		this.current_y = 4.5;
	}
	
}

AuxiliaryBoard.prototype.display = function() {
	if (this.type == 1) {
		this.scene.pushMatrix();
			this.material.apply();
			this.box.display();
		this.scene.popMatrix();
	}
}

AuxiliaryBoard.prototype.addPiece = function() {
	if (this.type == 1) {
		this.current_y += this.change;
	}
	else if (this.type == 2) {
		this.count++;
		this.current_ang += Math.PI/25;
		if (this.count == 25) {
			this.current_ang = 0;
			this.radius = 9;
		}
		this.current_x = this.p*Math.cos(this.current_ang)*this.radius + this.origin;
		this.current_y = this.p*Math.sin(this.current_ang)*this.radius + this.origin;
	}
}

AuxiliaryBoard.prototype.removePiece = function() {
	if (this.type == 1) {
		this.current_y -= this.change;
	}
	else if (this.type == 2) {
		this.count--;
		this.current_ang -= Math.PI/25;
		if (this.count == 24) {
			this.current_ang = 23*Math.PI/24;
			this.radius = 8;
		}
		this.current_x = this.p*Math.cos(this.current_ang)*this.radius + this.origin;
		this.current_y = this.p*Math.sin(this.current_ang)*this.radius + this.origin;
	}
}
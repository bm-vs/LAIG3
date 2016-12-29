function Piece(scene, id, x, y) {
	this.scene = scene;
	this.id = id;
	this.x = x;
	this.y = y;
	this.z = 0;
	this.ang = 0;
	this.piece = new Cylinder(scene, 0.42, 0.42, 32, 8, 0.17);
	this.appearance = new CGFappearance(scene);
	this.selected = false;
	this.selected_appearance = new CGFappearance(scene);
	var selected_color = [50, 137, 54];
	
	this.sel_r = selected_color[0]/255;
	this.sel_g = selected_color[1]/255;
	this.sel_b = selected_color[2]/255;
	this.n_steps = 60;
	
	if (xor(this.x % 2 == 0, this.y % 2 == 0)) {
		this.appearance.setAmbient(0.1, 0.1, 0.1, 1.0);
		this.appearance.setDiffuse(0.1, 0.1, 0.1, 1.0);
		this.selected_appearance.setAmbient(0.1, 0.1, 0.1, 1.0);
		this.selected_appearance.setDiffuse(0.1, 0.1, 0.1, 1.0);
		this.step_r = (this.sel_r - 0.1)/this.n_steps;
		this.step_g = (this.sel_g - 0.1)/this.n_steps;
		this.step_b = (this.sel_b - 0.1)/this.n_steps;		
		this.player = 1;
	}
	else {
		this.appearance.setAmbient(1.0, 1.0, 1.0, 1.0);
		this.appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.selected_appearance.setAmbient(1.0, 1.0, 1.0, 1.0);
		this.selected_appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.step_r = (this.sel_r - 1.0)/this.n_steps;
		this.step_g = (this.sel_g - 1.0)/this.n_steps;
		this.step_b = (this.sel_b - 1.0)/this.n_steps;
		this.player = 2;
	}
	
	
}

Piece.prototype.display = function() {
	this.scene.pushMatrix();
		// Piece pulse when selected
		if (this.selected) {
			var amb_r = this.appearance.ambient[0];
			var sel_r = this.selected_appearance.ambient[0];
			var sel_g = this.selected_appearance.ambient[1];
			var sel_b = this.selected_appearance.ambient[2];
		
			// Wrap around with selected color hit
			if (this.step_r > 0 && this.selected_appearance.ambient[0] > Math.max(this.sel_r, amb_r) ||
				this.step_r < 0 && this.selected_appearance.ambient[0] < Math.min(this.sel_r, amb_r)) {
				
				this.step_r = -this.step_r;
				this.step_g = -this.step_g;
				this.step_b = -this.step_b;
			}
			
			this.selected_appearance.setAmbient(sel_r+this.step_r, sel_g+this.step_g, sel_b+this.step_b, 1.0);
			this.selected_appearance.setDiffuse(sel_r+this.step_r, sel_g+this.step_g, sel_b+this.step_b, 1.0);
			
			this.selected_appearance.apply();
		}
		else {
			this.appearance.apply();
		}
		//this.scene.scale(1, 1, 0.75);
		this.scene.translate(this.x, this.y, 0.4+this.z);
		this.scene.rotate(this.ang, 1, 0, 0);
		this.scene.registerForPick(this.id, this);
		this.piece.display();
	this.scene.popMatrix();
}

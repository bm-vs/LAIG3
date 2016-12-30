function Tree(scene) {
	this.scene = scene;
	
	this.trunk = new Cylinder(scene, 0.75, 0.75, 128, 128, 10);
	this.bottom = new Cylinder(scene, 4, 1, 128, 128, 5);
	this.middle = new Cylinder(scene, 3, 0, 128, 128, 5);		
	this.top = new Cylinder(scene, 2, 0, 128, 128, 4);
	this.light = new Sphere(scene, 1, 64, 64);
	
	this.trunk_texture = new CGFappearance(this.scene);
	this.trunk_texture.setAmbient(1.0, 1.0, 1.0, 1.0);
	this.trunk_texture.setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.trunk_texture.loadTexture('../resources/wood.jpg');
	
	this.leaves_texture = new CGFappearance(this.scene);
	this.leaves_texture.setAmbient(1.0, 1.0, 1.0, 1.0);
	this.leaves_texture.setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.leaves_texture.loadTexture('../resources/leaves.jpg');
	
	this.colors =  [[1.0, 0.0, 0.0],
					[1.0, 0.5, 0.0],
					[1.0, 1.0, 0.0],
					[0.5, 1.0, 0.0],
					[0.0, 1.0, 0.0],
					[0.0, 1.0, 0.5],
					[0.0, 1.0, 1.0],
					[0.0, 0.5, 1.0],
					[0.0, 0.0, 1.0],
					[0.5, 0.0, 1.0],
					[1.0, 0.0, 1.0],
					[1.0, 0.0, 0.5]];
	
	this.light_textures = [];
	for (var i = 0; i < 8; i++) {
		var light_texture = new CGFappearance(this.scene);
		var n = Math.floor(Math.random() * 12);
		var c = this.colors[n];
	
		light_texture.setAmbient(c[0], c[1], c[2], 1.0);
		light_texture.setDiffuse(c[0], c[1], c[2], 1.0);
		light_texture.setEmission(c[0], c[1], c[2], 1.0);
	
		this.light_textures.push(light_texture);
	}
					
	this.timer = 0;				
}

Tree.prototype.update = function() {
	this.timer += this.scene.updatePeriod/1000;

	if (this.timer >= 1) {
		this.timer = 0;
	
		for (var i = 0; i < 8; i++) {
			var n = Math.floor(Math.random() * 12);
			var c = this.colors[n];
		
			this.light_textures[i].setAmbient(c[0], c[1], c[2], 1.0);
			this.light_textures[i].setDiffuse(c[0], c[1], c[2], 1.0);
			this.light_textures[i].setEmission(c[0], c[1], c[2], 1.0);
		}
	}
}



Tree.prototype.display = function(){
	this.scene.pushMatrix();
		this.trunk_texture.apply();
		this.trunk.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, 0, 5);
		this.leaves_texture.apply();
		this.bottom.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, 0, 8);
		this.leaves_texture.apply();
		this.middle.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, 0, 11);
		this.leaves_texture.apply();
		this.top.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, 3.5, 6);
		this.scene.rotate(Math.PI/5, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.4);
		this.light_textures[0].apply();
		this.light.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(-1.75, -3.0, 6);
		this.scene.rotate(Math.PI*2/3, 0, 0, 1);
		this.scene.rotate(Math.PI/5, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.4);
		this.light_textures[1].apply();
		this.light.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(3.5, 0, 6);
		this.scene.rotate(-Math.PI/3, 0, 0, 1);
		this.scene.rotate(Math.PI/5, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.4);
		this.light_textures[2].apply();
		this.light.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(-1.75, -3.0, 6);
		this.scene.rotate(Math.PI*2/3, 0, 0, 1);
		this.scene.rotate(Math.PI/5, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.4);
		this.light_textures[3].apply();
		this.light.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(1.8, -1.8, 9);
		this.scene.rotate(-Math.PI/2, 0, 0, 1);
		this.scene.rotate(Math.PI/5, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.4);
		this.light_textures[4].apply();
		this.light.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(-1.8, 1.8, 9);
		this.scene.rotate(Math.PI/2, 0, 0, 1);
		this.scene.rotate(Math.PI/5, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.4);
		this.light_textures[5].apply();
		this.light.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(-1.2, -1.2, 12);
		this.scene.rotate(Math.PI*4/5, 0, 0, 1);
		this.scene.rotate(Math.PI/5, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.4);
		this.light_textures[6].apply();
		this.light.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(1.2, 1.2, 12);
		this.scene.rotate(-Math.PI*4/5, 0, 0, 1);
		this.scene.rotate(Math.PI/5, 1, 0, 0);
		this.scene.scale(0.2, 0.2, 0.4);
		this.light_textures[7].apply();
		this.light.display();
	this.scene.popMatrix();
}
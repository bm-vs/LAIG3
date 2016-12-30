function SnowMan(scene) {
	this.scene = scene;
	
	this.sphere = new Sphere(scene, 2, 128, 128);
	this.nose = new Cylinder(scene, 1, 0, 16, 8, 1);
	this.pebble = new Sphere(scene, 0.2, 16, 16);
	this.arm = new Cylinder(scene, 0.5, 0.5, 16, 16, 1);
	
	this.snow_texture = new CGFappearance(this.scene);
	this.snow_texture.setAmbient(1.0, 1.0, 1.0, 1.0);
	this.snow_texture.setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.snow_texture.loadTexture('../resources/snow.jpg');
	
	this.nose_texture = new CGFappearance(this.scene);
	this.nose_texture.setAmbient(1.0, 0.5, 0.0, 1.0);
	this.nose_texture.setDiffuse(1.0, 0.5, 0.0, 1.0);
	
	this.pebble_texture = new CGFappearance(this.scene);
	this.pebble_texture.setAmbient(0.0, 0.0, 0.0, 1.0);
	this.pebble_texture.setDiffuse(0.0, 0.0, 0.0, 1.0);
	
	this.arm_texture = new CGFappearance(this.scene);
	this.arm_texture.setAmbient(1.0, 1.0, 1.0, 1.0);
	this.arm_texture.setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.arm_texture.loadTexture('../resources/wood.jpg');
}

SnowMan.prototype.display = function(){
	this.scene.pushMatrix();
		this.snow_texture.apply();
		this.sphere.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, 0, 2);
		this.scene.scale(0.7, 0.7, 0.7);
		this.sphere.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, -1.35, 2);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.scene.scale(0.25, 0.25, 1);
		this.nose_texture.apply();
		this.nose.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0.5, -1.2, 2.25);
		this.pebble_texture.apply();
		this.pebble.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(-0.5, -1.2, 2.25);
		this.pebble_texture.apply();
		this.pebble.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, -1.95, 0.35);
		this.pebble_texture.apply();
		this.pebble.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, -1.50, 1.2);
		this.pebble_texture.apply();
		this.pebble.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(0, -1.9, -0.5);
		this.pebble_texture.apply();
		this.pebble.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(1.4, -0.9, 0.9);
		this.scene.rotate(Math.PI/2, 0, 0, 1);
		this.scene.rotate(Math.PI/8, 1, 0, 0);
		this.scene.scale(0.25, 0.25, 3);
		this.arm_texture.apply();
		this.arm.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(-1.4, -0.9, 0.9);
		this.scene.rotate(Math.PI/2, 0, 0, 1);
		this.scene.rotate(Math.PI*4/3, 1, 0, 0);
		this.scene.scale(0.25, 0.25, 3);
		this.arm_texture.apply();
		this.arm.display();
	this.scene.popMatrix();
	
}
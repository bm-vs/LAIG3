function Cube(scene) {
	this.scene = scene;
    this.quad = new Quad(this.scene);
}

Cube.prototype.display= function() {
    this.scene.pushMatrix();
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI,0,1,0)
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2,0,1,0)
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,0,1,0)
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/2,1,0,0)
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,1,0,0)
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();
  
}
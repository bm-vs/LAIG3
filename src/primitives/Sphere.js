
function Sphere(scene, radius, slices, stacks) {
    CGFobject.call(this,scene);

    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
}

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor=Sphere;

Sphere.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var stack = 0; stack <= this.stacks; stack++) {
        var alpha = stack*Math.PI / this.stacks;
        
        for (var slice = 0; slice <= this.slices; slice++) {
            var beta = slice*2*Math.PI /this.slices;

            var x = Math.cos(beta) * Math.sin(alpha);
            var y = Math.cos(alpha);
            var z = Math.sin(alpha) * Math.sin(beta);

            var u = 1 - (slice/this.slices);
            var v = 1 - (stack/this.stacks);

            this.normals.push(x, y, z);
            this.texCoords.push(u, v);
            this.vertices.push(this.radius*x, this.radius*y, this.radius*z);            
        }
    }

    for (var stack = 0; stack < this.stacks; stack++) {        
        for (var slice = 0; slice < this.slices; slice++) {
            var first = stack*(this.slices+1) + slice;
            var second = first + this.slices + 1;

            this.indices.push(first, first+1, second, second, first+1, second+1);
        }
    }

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
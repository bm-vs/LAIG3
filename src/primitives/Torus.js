function Torus(scene, inner, outer, slices, loops) {
    CGFobject.call(this,scene);

    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
}

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor=Torus;

Torus.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var radius = this.inner + (this.outer-this.inner)/2;
    var thick = (this.outer-this.inner)/2;


    for (var loop = 0; loop <= this.loops; loop++) {
        var beta = loop/this.loops * (Math.PI*2);

        for (var slice = 0; slice <= this.slices; slice++) {
            var alpha = slice/this.slices * (Math.PI*2);

            var x = (radius + thick*Math.cos(beta)) * Math.cos(alpha);
            var y = (radius + thick*Math.cos(beta)) * Math.sin(alpha);
            var z = thick*Math.sin(beta);

            var centerx = radius * Math.cos(alpha);
            var centery = radius * Math.sin(alpha);
            var centerz = 0;

            var normalx = x-centerx;
            var normaly = y-centery;
            var normalz = z-centerz;

            var l = Math.sqrt(normalx*normalx+normaly*normaly+normalz*normalz);

            normalx = normalx/l;
            normaly = normaly/l;
            normalz = normalz/l;

            this.vertices.push(x, y, z);
            this.normals.push(normalx,normaly,normalz);
            this.texCoords.push(slice/this.slices,loop/this.loops);
        }
    }


    for (var loop = 0; loop < this.loops; loop++) {
        for (var slice = 0; slice < this.slices; slice++) {
            var first = (loop * (this.slices + 1)) + slice;
            var second = first + this.slices + 1;

            this.indices.push(first, second+1, second);
            this.indices.push(first, first+1, second+1);
        }
    }

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
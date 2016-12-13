function Cylinder(scene, base, top, slices, stacks, height) {
    CGFobject.call(this,scene);

    this.base = base;
    this.top = top;
    this.slices = slices;
    this.stacks = stacks;
    this.height = height;

    this.initBuffers();
}

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function() {
    var angle = (2*(Math.PI)) / this.slices;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // Cylinder
    for (var stack = 0; stack <= this.stacks; stack++) {
       for (var slice = 0; slice < this.slices; slice++) {
           var h = this.height/this.stacks * stack;

           var x1 = this.radius(stack)*Math.cos(slice * angle);
           var y1 = this.radius(stack)*Math.sin(slice * angle);

           this.vertices.push(x1,y1,h);
           this.normals.push(x1,y1,0);
           this.texCoords.push(slice/this.slices, stack/this.stacks);
       }
    }

    for (var stack = 0; stack < this.stacks; stack++) {
        for (var slice = 0; slice < this.slices; slice++) {
            var v1 = stack * this.slices + slice;
            var v2;
            var v3;
            var v4 = (stack + 1)*this.slices + slice;

            if (slice == this.slices - 1) {
                v2 = stack*this.slices + slice + 1 - this.slices;
                v3 = (stack + 1)*this.slices + slice + 1 - this.slices;
            }
            else {
                v2 = stack*this.slices + slice + 1;
                v3 = (stack + 1)*this.slices + slice + 1;
            }

            this.indices.push(v1,v2,v3);
            this.indices.push(v1,v3,v4);
        }
    }


    // Covers
    var vsize = this.vertices.length/3 - 1;

    this.vertices.push(0,0,0);
    this.texCoords.push(0.5, 0.5);
    this.normals.push(0,0,-1);

    for (var slice = 0; slice < this.slices; slice++) {
        var x1 = this.base*Math.cos(slice * angle);
        var y1 = this.base*Math.sin(slice * angle);

        this.vertices.push(x1,y1,0);
        this.normals.push(0,0,-1);
        this.texCoords.push(Math.cos(slice * angle)/2+0.5, Math.sin(slice * angle)/2+0.5);
    }

    for (var slice = 1; slice <= this.slices; slice++) {
        if (slice == this.slices) {
            this.indices.push(vsize+1, vsize+2, vsize+1+slice);
        }
        else {
            this.indices.push(vsize+1, vsize+2+slice, vsize+1+slice);
        }
    }




    vsize = this.vertices.length/3 - 1;

    this.vertices.push(0,0,this.height);
    this.texCoords.push(0.5, 0.5);
    this.normals.push(0,0,1);

    for (var slice = 0; slice < this.slices; slice++) {
        var x1 = this.top*Math.cos(slice * angle);
        var y1 = this.top*Math.sin(slice * angle);

        this.vertices.push(x1,y1,this.height);
        this.texCoords.push(Math.cos(slice * angle)/2+0.5, Math.sin(slice * angle)/2+0.5);
        this.normals.push(0,0,1);
    }

    for (var slice = 1; slice <= this.slices; slice++) {
        if (slice == this.slices) {
            this.indices.push(vsize+1, vsize+1+slice, vsize+2);
        }
        else {
            this.indices.push(vsize+1, vsize+1+slice, vsize+2+slice);
        }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

// Returns the radius of the cylinder/cone at given stack
Cylinder.prototype.radius = function(stack) {
    var x = this.height/this.stacks * stack;
    var m = (this.top-this.base)/this.height;

    return m*x + this.base;
}
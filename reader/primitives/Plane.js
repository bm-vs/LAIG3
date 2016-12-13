function Plane(scene, dimX, dimY, partsX, partsY) {
	var knots1 = this.getKnotsVector(1);
	var knots2 = this.getKnotsVector(1);

	var controlvertexes = [];
	controlvertexes.push([[-dimX/2,-dimY/2,0,1], [-dimX/2,dimY/2,0,1]]);
	controlvertexes.push([[dimX/2,-dimY/2,0,1],[dimX/2,dimY/2,0,1]]);


	var nurbsSurface = new CGFnurbsSurface(1, 1, knots1, knots2, controlvertexes);
	
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
}


Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor=Plane;

/*
From NURBS example
*/
Plane.prototype.getKnotsVector = function(degree) {
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

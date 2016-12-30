function Patch(scene) {
	var orderU = 5;
	var orderV = 5;
	var partsU = 128;
	var partsV = 128;

	var control_points = [[0.0,0.0,0.0],[0.0,0.1,0.0],[0.0,0.2,0.0],[0.0,0.3,0.0],[0.0,0.4,0.0],[0.0,0.5,0.0],
							[0.1,0.0,0.0],[0.1,0.1,0.2],[0.1,0.2,0.1],[0.1,0.3,-0.2],[0.1,0.4,0.1],[0.1,0.5,0.0],
							[0.2,0.0,0.0],[0.2,0.1,-0.2],[0.2,0.2,0.2],[0.2,0.3,0.3],[0.2,0.4,-0.1],[0.2,0.5,0.0],
							[0.3,0.0,0.0],[0.3,0.1,0.1],[0.3,0.2,-0.2],[0.3,0.3,-0.2],[0.3,0.4,0.1],[0.3,0.5,0.0],
							[0.4,0.0,0.0],[0.4,0.1,0.1],[0.4,0.2,-0.3],[0.4,0.3,0.1],[0.4,0.4,0.2],[0.4,0.5,0.0],
							[0.5,0.0,0.0],[0.5,0.1,0.0],[0.5,0.2,0.0],[0.5,0.3,0.0],[0.5,0.4,0.0],[0.5,0.5,0.0]];

	var knots1 = this.getKnotsVector(orderU);
	var knots2 = this.getKnotsVector(orderV);

	var controlvertexes = [];
	var count = 0;
	for (var i = 0; i <= orderU; i++) {
		var vectorU = [];		

		for (var j = 0; j <= orderV; j++) {
			var vectorV = [];
			vectorV[0] = control_points[count][0];
			vectorV[1] = control_points[count][1];
			vectorV[2] = control_points[count][2];
			vectorV[3] = 1;
			vectorU.push(vectorV);

			count++;
		}

		controlvertexes.push(vectorU);
	}

	var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knots1, knots2, controlvertexes);
	
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);
}


Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor=Patch;

Patch.prototype.getKnotsVector = function(degree) {
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}
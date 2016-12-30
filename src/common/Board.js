function Board(scene) {
	this.scene = scene;
	this.type = localStorage.theme;
	
	// Board settings
	var du = 10; // number of divisions
	var dv = 10;
	this.height = 0.075;
	var color1 = [1, 1, 1]; // colors
	var color2 = [0.8, 0.4, 0.4];
	this.shader = new CGFshader(scene.gl, "../shaders/board.vert", "../shaders/board.frag"); // shader
	this.shader.setUniformsValues({du:du, dv:dv, color1:color1, color2:color2});

	this.material = new CGFappearance(this.scene);
	this.material.loadTexture('../resources/wood.jpg');
	
	// Board primitives
	this.top = new Plane(scene, 1.0, 1.0, du, dv);
	this.side = new Plane(scene, 1.0, this.height, du, 1);
	if (this.type == 2) {
		this.shader2 = new CGFshader(scene.gl, "../shaders/board.vert", "../shaders/extension.frag"); // shader
		this.shader2.setUniformsValues({du:du, dv:dv, color1:color1});
		this.extension = new Cylinder(scene, 0.95, 0.95, 128, 8, this.height+0.005);
	}
	if (this.type == 3) {
		this.snow_texture = new CGFappearance(this.scene);
		this.snow_texture.setAmbient(1.0, 1.0, 1.0, 1.0);
		this.snow_texture.setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.snow_texture.loadTexture('../resources/snow.jpg');
		this.snow = new Patch(scene);
		
		this.tree = new Tree(scene);
		this.snow_man = new SnowMan(scene);
	}
	
	// Tiles
	this.tiles = [];
	var id = 0;
	for (var line = 0; line < 10; line++) {
		for (column = 0; column < 10; column++) {
			this.tiles[id] = new Tile(scene, id+101, column, line, false);
			id++;
		}
	}
}

Board.prototype.deSelectAllTiles = function() {
	for (var i = 0; i < this.tiles.length; i++) {
		this.tiles[i].selected = false;
	}
}

Board.prototype.setSelectedTiles = function(tiles) {
	// Only show selected tiles when the current player is a human
	if ((this.scene.gameState.current_player == 1 && localStorage.player1 == "Player") ||
		(this.scene.gameState.current_player == 2 && localStorage.player2 == "Player")) {
			for (var i = 0; i < this.tiles.length; i++) {
				if (tiles.indexOf(this.tiles[i].id - 101) >= 0) {
					this.tiles[i].selected = true;
				}
			}
	}
}

Board.prototype.getTile = function(n) {
	return this.tiles[n];
}

Board.prototype.display = function() {
	this.scene.pushMatrix();	
		this.material.apply();
		this.scene.setActiveShader(this.shader);
		this.scene.translate(0, 0, this.height/2);
		this.top.display();		
		this.scene.setActiveShader(this.scene.defaultShader);
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, -this.height/2);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.top.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.5, 0, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.rotate(Math.PI/2, 0, 0, 1);
		this.side.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.5, 0, 0);
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.scene.rotate(Math.PI/2, 0, 0, 1);
		this.side.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0.5, 0);
		this.scene.rotate(Math.PI/2, 0, 0, 1);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.rotate(Math.PI/2, 0, 0, 1);
		this.side.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, -0.5, 0);
		this.scene.rotate(-Math.PI/2, 0, 0, 1);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.rotate(Math.PI/2, 0, 0, 1);
		this.side.display();
	this.scene.popMatrix();
	
	if (this.type == 2) {
		this.scene.pushMatrix();
			this.scene.setActiveShader(this.shader2);
			this.scene.translate(0, 0, -this.height/2-0.009);
			this.extension.display();
			this.scene.setActiveShader(this.scene.defaultShader);
		this.scene.popMatrix();
	}
	
	if (this.type == 3) {
		this.scene.pushMatrix();
			this.scene.translate(-0.6, 0.65, -0.1);
			this.scene.scale(0.05, 0.05, 0.05);
			this.tree.display();
		this.scene.popMatrix();
	
		this.scene.pushMatrix();
			this.scene.translate(0.6, 0.65, 0.075);
			this.scene.rotate(-Math.PI/8, 0, 0, 1);
			this.scene.scale(0.05, 0.05, 0.05);
			this.snow_man.display();
		this.scene.popMatrix();
	
		this.scene.pushMatrix();
			this.snow_texture.apply();
			this.scene.translate(-1, -1, 0);
			this.scene.scale(4, 4, 0.8);
			this.snow.display();
		this.scene.popMatrix();
	}

	for (var tiles = 0; tiles < this.tiles.length; tiles++) {
		this.scene.pushMatrix();
			this.scene.translate(-0.45, -0.45, this.height/2);
			this.tiles[tiles].display();
		this.scene.popMatrix();
	}
}

Board.prototype.update = function() {
	if (this.type == 3) {
		this.tree.update();
	}
}

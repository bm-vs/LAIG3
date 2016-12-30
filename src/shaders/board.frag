#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
uniform float du;
uniform float dv;

uniform vec3 color1;
uniform vec3 color2;

varying vec2 vTextureCoord;

void main() {
	vec4 textureColor = texture2D(uSampler, vTextureCoord);
	vec4 col1 = vec4(color1, 1.0);
	vec4 col2 = vec4(color2, 1.0);

	if ((mod(du/2.0*vTextureCoord.x, 1.0) < 0.5) ^^ (mod(dv/2.0*vTextureCoord.y, 1.0) < 0.5)) {
		gl_FragColor = textureColor*col1;
	}
	else {
		gl_FragColor = textureColor*col2;
	}
}

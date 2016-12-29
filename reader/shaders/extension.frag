#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
uniform float du;
uniform float dv;

uniform vec3 color1;

varying vec2 vTextureCoord;

void main() {
	vec4 textureColor = texture2D(uSampler, vTextureCoord);
	vec4 col1 = vec4(color1, 1.0);

	gl_FragColor = textureColor*col1;
}

#version 300 es
precision highp float;

uniform sampler2D uShadingTex;

in vec2 vUv;

layout (location = 0) out vec4 outColor;

void main( void ) {

	vec4 c = texture( uShadingTex, vUv );
  
	vec3 bright = max( c.xyz - 1.0, vec3( 0.0 ) ) / 18.0;

	outColor = vec4( bright, 1.0 );
	
}
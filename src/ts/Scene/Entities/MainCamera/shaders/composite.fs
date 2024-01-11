#include <common>
#include <noise>

uniform sampler2D backbuffer0;
uniform sampler2D uBloomTexture[4];

uniform vec3 cameraPosition;
uniform float cameraNear;
uniform float cameraFar;

uniform float uTime;
uniform float uGlitch;

in vec2 vUv;

layout (location = 0) out vec4 outColor;

vec2 lens_distortion(vec2 r, float alpha) {
    return r * (1.0 - alpha * dot(r, r));
}

void main( void ) {
	vec3 col = vec3( 0.0, 0.0, 0.0 );
	vec2 uv = vUv;

	// glitch ---------------

	float glitch = uGlitch;

	float g = 0.0;

	g += (random( floor( vUv * 3.3) / 3.3 + uTime ) - 0.5) * 0.2;
	g += (random( floor( vUv * 10.0) / 10.0 + uTime ) - 0.5) * 0.08;
	g += (random( floor( vUv * 40.0) / 40.0 + uTime ) - 0.5) * 0.03;
	g += (random( floor( vUv * vec2( 1.0, 100.0 )) / vec2( 1.0, 100.0 ) + uTime ) - 0.5) * 0.02;
	g += (random( vUv + uTime ) - 0.5) * 0.03;
	g += ( smoothstep( 0.9, 1.0, random( vec2( floor( vUv.y * 20.0) / 20.0 ) + uTime ) ) ) * 0.9;

	uv.x += g * glitch * 1.0;
	
	col.xyz += ( smoothstep( 0.9, 1.0, random( vec2( floor( vUv.y * 3.0) / 3.0 ) + uTime ) ) ) * 5.0 * glitch;
	
	// ------------------------
	
	vec2 cuv = uv - 0.5;
	float w = 0.02;

	float d;
	float s = 0.99;

	#pragma loop_start 8
		d = -float( LOOP_INDEX ) / 8.0 * w;
        col.x += texture( backbuffer0, lens_distortion( cuv * s, d * 0.0 ) + 0.5 + vec2( (float( LOOP_INDEX ) / 8.0 - 0.5 ) * 0.002, 0.0 ) ).x;
        col.y += texture( backbuffer0, lens_distortion( cuv * s, d * 3.0 ) + 0.5 ).y;
        col.z += texture( backbuffer0, lens_distortion( cuv * s, d * 6.0 ) + 0.5 ).z;
	#pragma loop_end
	col.xyz /= 8.0;


	#pragma loop_start 4
		col += texture( uBloomTexture[ LOOP_INDEX ], cuv * s + 0.5 ).xyz * pow( (float(LOOP_INDEX) + 1.0) / 4.0, 1.0 ) * 2.0;
	#pragma loop_end

	float len = length(cuv);
	// col *= mix( vec3( 1.1 ), vec3( 1.3, 1.1, 1.0 ),  1.0 - smoothstep( 1.0, 0.0, len ) );
	
	outColor = vec4( col, 1.0 );

}
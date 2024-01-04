#include <common>
#include <packing>
#include <frag_h>
#include <rotate>

uniform sampler2D uTex;
uniform float uTime;

in vec3 vBasePos;

void main( void ) {

	#include <frag_in>

	float t = uTime * 5.0;
	t = 22.;

	vec3 emit = vec3( 
		smoothstep( -1.0, 1.0, sin( abs( vBasePos.y ) * 8.0 - t * 1.0 ) ),
		smoothstep( -1.0, 1.0, sin( abs( vBasePos.y ) * 8.0 - t * 1.3 ) ),
		smoothstep( -1.0, 1.0, sin( abs( vBasePos.y ) * 8.0 - t * 1.6 ) )
	);

	outEmission = emit;
	outEmissionIntensity = smoothstep( 0.5, 1.5, length( emit ) ) * 3.0;

	#include <frag_out>

}
#include <common>
#include <packing>
#include <frag_h>
#include <rotate>

uniform sampler2D uTex;
uniform float uTime;

in vec3 vBasePos;

void main( void ) {

	#include <frag_in>

	vec3 emit = vec3( 
		smoothstep( 0.0, 1.0, sin( abs( vBasePos.y ) * 8.0 - uTime * 5.0 + 0.0 ) ),
		smoothstep( 0.0, 1.0, sin( abs( vBasePos.y ) * 8.0 - uTime * 5.0 + 0.5) ),
		smoothstep( 0.0, 1.0, sin( abs( vBasePos.y ) * 8.0 - uTime * 5.0 + 1.0) )
	);

	outEmission = vec3( 1.0 ) * emit * 3.0;
	outEmissionIntensity = 4.0;

	#include <frag_out>

}
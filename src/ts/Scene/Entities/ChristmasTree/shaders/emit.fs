#include <common>
#include <frag_h>

uniform float uTime;
uniform float uType;

void main( void ) {

	#include <frag_in>

	float emit = step( sin( uTime * 2.0 ), 0.0 );

	outEmissionIntensity += 100.0 * emit;
	outEmission += 1.0 * emit;
	outColor *= emit;

	#include <frag_out>

}
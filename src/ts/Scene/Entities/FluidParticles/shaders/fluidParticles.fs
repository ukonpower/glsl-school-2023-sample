#include <common>
#include <packing>
#include <frag_h>

#include <re>

in vec3 vRnd;

uniform float uTime;

void main( void ) {

	#include <frag_in>

	outColor = vec4( 1.0 );

	float dnv = dot( normalize( vViewNormal ), normalize( -vMVPosition ) );

	float emit = step( 0.99, length( vRnd ) );
	outColor.xyz += vec3( vRnd ) * emit * 10.0;
	outColor.w *= sin( vRnd.z * PI - uTime * 2.0 ) * 0.5 + 0.5;
	
	#include <frag_out>

} 
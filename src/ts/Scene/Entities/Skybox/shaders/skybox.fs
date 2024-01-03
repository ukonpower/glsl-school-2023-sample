#include <common>
#include <packing>
#include <frag_h>

#include <re>

uniform vec3 cameraPosition;
uniform vec2 uResolution;
uniform float uAspectRatio;


void main( void ) {

	#include <frag_in>

	outColor += dot( vNormal, vec3( 0.0, 1.0, 0.0 ) );
	vec3 normal = normalize( - vNormal );
	// outEmission.xyz += smoothstep( -0.4, 0.5, dot( normal, vec3( 0.0, -1.0, 0.0 ) ) );
	outColor *= 0.0;
	
	#include <frag_out>

} 
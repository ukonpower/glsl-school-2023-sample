#include <common>
#include <vert_h>
#include <rotate>

uniform float uTime;

out vec3 vBasePos;

void main( void ) {

	#include <vert_in>

	vBasePos = outPos.xyz;

	float t = uTime;
	// t = 0.9;

	float rotX = easeInOut( sin( t + outPos.x * 0.025 ) * 0.5 + 0.5 ) * 2.0 * TPI;

	mat2 rot = rotate( rotX );
	outNormal.yz *= rot;
	outPos.yz *= rot;

	rot = rotate( sin( t * 1.8 ) * 0.2 );
	outNormal.xz *= rot;
	outPos.xz *= rot;

	float rotZ = easeInOut( sin( t * 0.5 ) * 0.5 + 0.5 ) * PI + PI;

	rot = rotate( rotZ );
	outNormal.xy *= rot;
	outPos.xy *= rot;
	
	outPos.z += ( sin( t * 3.0 ) ) * 0.5;
	
	#include <vert_out>
	
}
import { gl, globalUniforms } from "~/ts/Globals";
import { TexProcedural } from "~/ts/libs/TexProcedural";

import noiseFrag from './shaders/noise.fs';
import { GLPowerTextureCube } from "glpower";

export const createTextures = () => {

	globalUniforms.tex.uNoiseTex = {
		value: new TexProcedural( {
			frag: noiseFrag
		} ),
		type: '1i'
	};

	globalUniforms.tex.uEnvTex = {
		value: new GLPowerTextureCube( gl ),
		type: '1i'
	};


	const prms = [
		BASE_PATH + '/env/px.png',
		BASE_PATH + '/env/py.png',
		BASE_PATH + '/env/pz.png',
		BASE_PATH + '/env/nx.png',
		BASE_PATH + '/env/ny.png',
		BASE_PATH + '/env/nz.png'
	].map( path => new Promise<HTMLImageElement>( ( r )=> {

		const img = document.createElement( "img" );

		img.onload = () => {

			r( img );

		};

		img.src = path;

	} ) );

	Promise.all( prms ).then( imgs => {

		globalUniforms.tex.uEnvTex.value.attach( imgs );

	} );

};

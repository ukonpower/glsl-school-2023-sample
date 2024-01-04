import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import { gl, globalUniforms } from '~/ts/Globals';

import dustParticlesVert from './shaders/dustParticles.vs';
import dustParticlesFrag from './shaders/dustParticles.fs';

export class DustParticles extends MXP.Entity {

	constructor() {

		super();

		// geometry

		const range = new GLP.Vector( 10.0, 10.0, 10.0 );
		const count = 500;

		const positionArray = [];
		const sizeArray = [];

		for ( let i = 0; i < count; i ++ ) {

			positionArray.push( ( Math.random() - 0.5 ) * range.x );
			positionArray.push( ( Math.random() - 0.5 ) * range.y );
			positionArray.push( ( Math.random() - 0.5 ) * range.z );

			sizeArray.push( Math.random() );

		}

		const geo = this.addComponent( "geometry", new MXP.Geometry() );
		geo.setAttribute( "position", new Float32Array( positionArray ), 3 );
		geo.setAttribute( "size", new Float32Array( sizeArray ), 1 );

		// mat

		const mat = this.addComponent( "material", new MXP.Material( {
			type: [ "forward" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, {
				uRange: {
					value: range,
					type: "3f"
				}
			} ),
			vert: MXP.hotGet( 'dustParticlesVert', dustParticlesVert ),
			frag: MXP.hotGet( 'dustParticlesFrag', dustParticlesFrag ),
			drawType: gl.POINTS
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( [ "./shaders/dustParticles.vs", "./shaders/dustParticles.fs" ], ( module ) => {

				if ( module[ 0 ] ) {

					mat.vert = MXP.hotUpdate( 'dustParticlesVert', module[ 0 ].default );

				}

				if ( module[ 1 ] ) {

					mat.frag = MXP.hotUpdate( 'dustParticlesFrag', module[ 1 ].default );

				}

				mat.requestUpdate();

			} );

		}

	}

}

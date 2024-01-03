import * as GLP from 'glpower';
import * as MXP from 'maxpower';

import presentVert from './shaders/present.vs';
import presentFrag from './shaders/present.fs';

import { globalUniforms } from '~/ts/Globals';

export class Present extends MXP.Entity {

	constructor() {

		super();

		// this.addComponent( "geometry", new MXP.CubeGeometry( 1, 1, 1 ) );

		this.on( "onModelLoaded", () => {

			const baseMat = this.getComponent<MXP.Material>( "material" )!;

			const mat = this.addComponent( "material", new MXP.Material( {
				name: "present",
				type: [ "deferred", "shadowMap" ],
				uniforms: GLP.UniformsUtils.merge( globalUniforms.time, baseMat.uniforms ),
				vert: MXP.hotGet( 'presentVert', presentVert ),
				frag: MXP.hotGet( 'presentFrag', presentFrag ),
				defines: baseMat.defines,
				cullFace: false,
			} ) );

			if ( import.meta.hot ) {

				import.meta.hot.accept( "./shaders/present.vs", ( module ) => {

					if ( module ) {

						mat.vert = MXP.hotUpdate( 'presentVert', module.default );

						mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( "./shaders/present.fs", ( module ) => {

					if ( module ) {

						mat.frag = MXP.hotUpdate( 'presentFrag', module.default );

						mat.requestUpdate();

					}

				} );

			}

		} );


	}

}

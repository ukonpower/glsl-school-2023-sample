import * as GLP from 'glpower';

import logoFrag from './shaders/logo.fs';
import logoVert from './shaders/logo.vs';
import { globalUniforms } from '~/ts/Globals';
import { Entity, Material, hotGet, hotUpdate } from 'maxpower';

export class Logo extends Entity {

	constructor() {

		super();

		this.on( "onModelLoaded", () => {

			const mat = this.addComponent( "material", new Material( {
				name: "logo",
				type: [ "deferred", "shadowMap" ],
				uniforms: GLP.UniformsUtils.merge( globalUniforms.time, { uNoiseTex: globalUniforms.tex.uNoiseTex } ),
				frag: hotGet( 'logoFrag', logoFrag ),
				vert: hotGet( 'logoVert', logoVert ),
			} ) );
			if ( import.meta.hot ) {

				import.meta.hot.accept( "./shaders/logo.fs", ( module ) => {

					if ( module ) {

						mat.frag = hotUpdate( 'logo', module.default );
						mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( "./shaders/logo.vs", ( module ) => {

					if ( module ) {

						mat.vert = hotUpdate( 'logoVert', module.default );
						mat.requestUpdate();

					}

				} );

			}

		} );



	}

}

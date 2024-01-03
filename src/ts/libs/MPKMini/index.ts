import * as GLP from 'glpower';
import { tmpVector } from '~/ts/Globals';

export class MPKMini extends GLP.EventEmitter {

	public input: MIDIInput | null;
	public output: MIDIOutput | null;

	public vectors: GLP.Vector[];
	public vectorsLerped: GLP.Vector[];

	public row1: number;
	public row2: number;

	constructor() {

		super();

		// values

		this.vectors = [];
		this.vectorsLerped = [];

		this.input = null;
		this.output = null;

		this.row1 = 0;
		this.row2 = 0;

		for ( let i = 0; i < 2; i ++ ) {

			this.vectors.push( new GLP.Vector() );
			this.vectorsLerped.push( new GLP.Vector() );

		}

		// midi

		navigator.requestMIDIAccess().then( ( m ) => {

			m.inputs.forEach( item => {

				if ( item.name == "MPK mini 3" ) {

					this.input = item;

				}

			} );

			if ( this.input ) {

				this.input.onmidimessage = this.onMidiMessage.bind( this ) as any;

			}

			m.outputs.forEach( item => {

				if ( item.name == "MPK mini 3" ) {

					this.output = item;

				}


			} );


		} );

		// keyboard simulator

		const onKeyDown = ( e: KeyboardEvent ) => {

			const num = Number( e.key );

			if ( ! Number.isNaN( num ) ) {

				this.pushRow1( num );

			}

		};

		window.addEventListener( 'keydown', onKeyDown );

		this.once( "dispose", () => {

			window.removeEventListener( "keydown", onKeyDown );

		} );

	}

	private onMidiMessage( e: MIDIMessageEvent ) {

		const type = e.data[ 0 ];
		const id = e.data[ 1 ];
		const value = e.data[ 2 ] / 127;

		// value

		if ( type == 176 && ( 70 <= id && id <= 77 ) ) {

			const offset = 70;

			const index = Math.floor( ( id - offset ) / 4 );

			const vec = this.vectors[ index ];

			const dim = ( id - offset ) % 4;

			if ( dim == 0 ) {

				vec.x = value;

			} else if ( dim == 1 ) {

				vec.y = value;

			} else if ( dim == 2 ) {

				vec.z = value;

			} else {

				vec.w = value;

			}

			this.emit( "vector/" + index, [ vec ] );
			this.emit( "vector/" + index + '/' + dim, [ value ] );

			return;

		}

		// buttons

		if ( type == 153 && ( 36 <= id && id <= 39 ) ) {

			const index = id - 36;

			this.emit( "pad2", [ index, value ] );
			this.emit( "pad2/" + index, [ value ] );

		}

		if ( type == 153 && ( 40 <= id && id <= 43 ) ) {

			const index = id - 40;

			this.emit( "pad1", [ index, value ] );
			this.emit( "pad1/" + index, [ value ] );

		}


	}


	public pushRow1( index: number ) {

		this.row1 = index;

		this.emit( "row1", [ this.row1 ] );
		this.emit( "row1/" + index, [ this.row1 ] );


	}

	public pushRow2( index: number ) {

		this.row2 = index;

		this.emit( "row2", [ this.row2 ] );
		this.emit( "row2/" + index, [ this.row2 ] );

	}

	public update( deltaTime: number ) {

		for ( let i = 0; i < this.vectors.length; i ++ ) {

			const vector = this.vectors[ i ];
			const lerped = this.vectorsLerped[ i ];

			lerped.add( tmpVector.copy( vector ).sub( lerped ).multiply( deltaTime * 4.0 ) );

		}

	}

	public dispose() {

		this.emit( "dispose" );

	}

}

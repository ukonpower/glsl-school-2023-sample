import * as GLP from 'glpower';
import * as MXP from 'maxpower';
import { tmpVector } from '~/ts/Globals';

export class MIDIMIX extends GLP.EventEmitter {

	public input: MIDIInput | null;
	public output: MIDIOutput | null;

	public vectors: GLP.Vector[];
	public vectorsLerped: GLP.Vector[];

	public row1: number[];
	public row2: number[];

	constructor() {

		super();

		// values

		this.vectors = [];
		this.vectorsLerped = [];

		this.input = null;
		this.output = null;

		this.row1 = [];
		this.row2 = [];

		for ( let i = 0; i < 8; i ++ ) {

			this.vectors.push( new GLP.Vector() );
			this.vectorsLerped.push( new GLP.Vector() );

			this.row1.push( 0 );
			this.row2.push( 0 );

		}

		// master

		this.vectors.push( new GLP.Vector() );
		this.vectorsLerped.push( new GLP.Vector() );

		// midi

		navigator.requestMIDIAccess().then( ( m ) => {

			m.inputs.forEach( item => {

				if ( item.name == "MIDI Mix" ) {

					this.input = item;

				}

			} );

			if ( this.input ) {

				this.input.onmidimessage = this.onMidiMessage.bind( this ) as any;

			}

			m.outputs.forEach( item => {

				if ( item.name == "MIDI Mix" ) {

					this.output = item;

				}


			} );

			// init

			this.updateLight();

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
		let id = e.data[ 1 ];
		const value = e.data[ 2 ] / 127;

		// value

		if ( type == 176 && ( 16 <= id && id <= 31 || 46 <= id && id <= 61 ) ) {

			if ( 46 <= id ) id -= 14;

			const index = Math.floor( ( id - 16 ) / 4 );

			const vec = this.vectors[ index ];

			const dim = id % 4;

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

		// master
		if ( type == 176 && id == 62 ) {

			this.vectors[ this.vectors.length - 1 ].x = value;

		}

		// buttons

		if ( type == 144 ) {

			if ( 1 <= id && id <= 24 ) {

				const num = Math.floor( id / 3 );

				if ( ( id + 2 ) % 3 == 0 ) {

					this.pushRow1( num );

				} else {

					this.pushRow2( num - 1 );

				}

			}

			if ( 25 <= id && id <= 27 ) {

				this.pushSide( id );

			}

			this.updateLight();

		}


	}


	public pushRow1( index: number ) {

		this.row1[ index ] = 1.0 - this.row1[ index ];

		this.emit( "row1", [ index, this.row1[ index ] ] );
		this.emit( "row1/" + index, [ this.row1[ index ] ] );

	}

	public pushRow2( index: number ) {

		this.row2[ index ] = 1.0 - this.row2[ index ];

		this.emit( "row2", [ this.row2 ] );
		this.emit( "row2/" + index, [ this.row2 ] );

	}

	public pushSide( index: number ) {

		this.emit( "side", [ index ] );
		this.emit( "side/" + index );

	}

	private updateLight() {

		if ( ! this.output ) return;

		// row1

		for ( let i = 0; i < 8; i ++ ) {

			this.output.send( [ 0x90, 1 + ( i ) * 3.0, this.row1[ i ] * 127 ] );

		}

		// row2

		for ( let i = 0; i < 8; i ++ ) {

			this.output.send( [ 0x90, 3 + i * 3, this.row2[ i ] * 127 ] );

		}

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

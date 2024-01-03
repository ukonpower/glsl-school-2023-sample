import * as GLP from 'glpower';
import * as MXP from 'maxpower';
import { midimix, mpkmini } from '~/ts/Globals';

export class BPM extends GLP.EventEmitter {

	private bpm: number;
	private timer: number;

	// calc
	private prevPushTime: number;

	constructor() {

		super();

		this.bpm = 10;
		this.timer = 0;

		this.prevPushTime = 0;

		// events

		mpkmini.on( 'pad2/2', () => {

			this.reset();

		} );

		mpkmini.on( 'pad2/3', () => {

			this.updateBpm();

		} );

	}

	public reset() {

		this.timer = 0;

	}

	public updateBpm() {

		const time = new Date().getTime();

		const diff = time - this.prevPushTime;

		this.prevPushTime = time;

		if ( diff > 5000 || diff < 100 ) return;

		const newBpm = 60 / ( diff / 1000 );

		this.bpm = this.bpm * 0.6 + newBpm * 0.4;

	}

	public update( deltaTime: number ) {

		this.timer += deltaTime / ( 60 / this.bpm );

		if ( this.timer >= 1.0 ) {

			this.timer = 0;

			this.emit( "tick/1" );

		}

	}

}

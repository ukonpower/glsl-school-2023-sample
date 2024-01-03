import * as GLP from 'glpower';
import { gl } from '~/ts/Globals';

export class Audio extends GLP.EventEmitter {

	public ctx;

	public analyser: AnalyserNode;
	public stream: MediaStream | null;

	public size: number;

	public timeDomainArray: Uint8Array;
	public timeDomainTexture: GLP.GLPowerTexture;

	public frequencyArray: Uint8Array;
	public frequencyTexture: GLP.GLPowerTexture;

	constructor() {

		super();

		this.size = 2048;

		this.ctx = new AudioContext();
		this.analyser = this.ctx.createAnalyser();
		this.analyser.fftSize = this.size;

		// texture

		this.timeDomainArray = new Uint8Array( this.analyser.fftSize );
		this.timeDomainTexture = new GLP.GLPowerTexture( gl );
		this.timeDomainTexture.setting( { type: gl.UNSIGNED_BYTE, internalFormat: gl.LUMINANCE, format: gl.LUMINANCE, magFilter: gl.LINEAR, minFilter: gl.LINEAR, wrapS: gl.MIRRORED_REPEAT } );
		this.timeDomainTexture.attach( { width: this.size, height: 1, data: this.timeDomainArray } );

		this.frequencyArray = new Uint8Array( this.analyser.frequencyBinCount );
		this.frequencyTexture = new GLP.GLPowerTexture( gl );
		this.frequencyTexture.setting( { type: gl.UNSIGNED_BYTE, internalFormat: gl.LUMINANCE, format: gl.LUMINANCE, magFilter: gl.LINEAR, minFilter: gl.LINEAR, wrapS: gl.MIRRORED_REPEAT } );
		this.frequencyTexture.attach( { width: this.analyser.frequencyBinCount, height: 1, data: this.frequencyArray } );

		// stream

		this.stream = null;

		const play = () => {

			this.ctx.resume();

			if ( ! this.stream ) {

				this.createStream();

			}

		};

		play();

		window.addEventListener( "click", () => {

			play();

		} );

	}

	private async createStream() {

		const devices = await navigator.mediaDevices.enumerateDevices();

		let label = "";
		label = "MacBook Proのマイク (Built-in)";
		label = "BlackHole 2ch (Virtu io Virtual Cable)";
		// label = "VoiceMeeter Output";
		// label = "VoiceMeeter Aux Input (VB-Audio VoiceMeeter AUX VAIO)";
		// label = 'CABLE Input (VB-Audio Virtual Cable)';
		label = 'CABLE Output (VB-Audio Virtual Cable)';

		const mic = devices.find( d => d.label.indexOf( label ) > - 1 );

		// devices.forEach( e => {

		// 	console.log( e.label );

		// } );


		const audio = mic ? { deviceId: mic.deviceId } : true;

		const stream = await navigator.mediaDevices.getUserMedia( {
			video: false, audio
		} );

		this.ctx.createMediaStreamSource( stream ).connect( this.analyser );

	}

	public update( deltaTime: number ) {

		this.analyser.getByteTimeDomainData( this.timeDomainArray );
		this.timeDomainTexture.attach( { width: this.size, height: 1, data: this.timeDomainArray } );

		this.analyser.getByteFrequencyData( this.frequencyArray );
		this.frequencyTexture.attach( { width: this.analyser.frequencyBinCount, height: 1, data: this.frequencyArray } );

	}

}

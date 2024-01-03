import * as GLP from 'glpower';
import { canvas, gpuState } from './Globals';
import { Scene } from "./Scene";
import config from '../../config.json';

class App {

	private scene: Scene;
	private canvas: HTMLCanvasElement;
	private cnavasContainer: HTMLElement;
	private canvasWrap: HTMLElement;

	constructor() {

		const elm = document.createElement( "div" );
		document.body.appendChild( elm );
		elm.innerHTML = `
			<div class="cc">
				<div class="cw"></div>
			</div>
			<h1>${config.title || 'UNTITLED'}</h1>
		`;

		this.canvasWrap = document.querySelector( '.cw' )!;
		this.cnavasContainer = document.querySelector( '.cc' )!;

		this.canvas = canvas;
		this.canvasWrap.appendChild( this.canvas );

		// scene

		this.scene = new Scene();

		// event

		window.addEventListener( 'resize', this.resize.bind( this ) );

		this.resize();

		// animate

		this.animate();

		// gpustate

		if ( process.env.NODE_ENV == 'development' ) {

			const debug = true;

			if ( gpuState && debug ) {

				const memoryElm = document.createElement( 'div' );
				memoryElm.classList.add( "dev" );
				memoryElm.style.position = "absolute";
				memoryElm.style.width = "50%";
				memoryElm.style.maxWidth = "300px";
				memoryElm.style.height = "100%";
				memoryElm.style.top = '0';
				memoryElm.style.left = "0";
				memoryElm.style.overflowY = 'auto';
				memoryElm.style.fontSize = "12px";
				this.canvasWrap.appendChild( memoryElm );

				const timerElm = document.createElement( 'div' );
				timerElm.classList.add( "dev" );
				timerElm.style.position = "absolute";
				timerElm.style.maxWidth = "300px";
				timerElm.style.width = "50%";
				timerElm.style.height = "100%";
				timerElm.style.top = "0";
				timerElm.style.right = "0";
				timerElm.style.overflowY = 'auto';
				timerElm.style.fontSize = "12px";
				this.canvasWrap.appendChild( timerElm );

				this.canvasWrap.style.fontFamily = "'Share Tech Mono', monospace";

				gpuState.init( memoryElm, timerElm );

			}

			// this.animate();

		}


	}

	private beforeDate?: number;

	private animate() {

		if ( gpuState ) {

			gpuState.update();

		}

		this.beforeDate = new Date().getTime();

		this.scene.update();

		if ( gpuState ) {

			const current = new Date().getTime();
			gpuState.setRenderTime( "cpuTotal", ( current - ( this.beforeDate || 0 ) ) );
			this.beforeDate = current;

		}

		window.requestAnimationFrame( this.animate.bind( this ) );

	}

	private resize() {

		const canvasAspect = window.innerWidth / window.innerHeight;

		let scale = canvasAspect < 1.0 ? Math.min( 1.5, window.devicePixelRatio ) : 1.0;

		scale *= 1.0;
		// scale *= 0.5;

		let blkRatioX = canvasAspect < 1.0 ? 0.8 : 1.0;
		let blkRatioY = canvasAspect < 1.0 ? 0.7 : 0.7;

		blkRatioX = 1.0;
		blkRatioY = 1.0;

		const width = window.innerWidth * blkRatioX;
		const height = window.innerHeight * blkRatioY;

		this.canvasWrap.style.width = width + 'px';
		this.canvasWrap.style.height = height + 'px';

		this.canvas.width = width * scale;
		this.canvas.height = height * scale;

		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";

		this.scene.resize( new GLP.Vector( this.canvas.width, this.canvas.height ) );

	}

}

new App();

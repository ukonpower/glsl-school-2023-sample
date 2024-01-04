import { GLPowerFrameBuffer } from "~/ts/libs/glpower_local/GLPowerFrameBuffer";
import { CameraParam, Camera } from "..";
import { power } from "~/ts/Globals";
import { Vector } from "glpower";

export type RenderCameraTarget = {
	gBuffer: GLPowerFrameBuffer,
	shadingBuffer: GLPowerFrameBuffer,
	forwardBuffer: GLPowerFrameBuffer,
	uiBuffer: GLPowerFrameBuffer,
}

export interface RenderCameraParam extends CameraParam {
	gl: WebGL2RenderingContext
}

export class RenderCamera extends Camera {

	public renderTarget: RenderCameraTarget;

	constructor( gl: WebGL2RenderingContext, param?: RenderCameraParam ) {

		super( param );

		const gBuffer = new GLPowerFrameBuffer( gl );
		gBuffer.setTexture( [
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA32F, format: gl.RGBA, magFilter: gl.NEAREST, minFilter: gl.NEAREST } ),
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA32F, format: gl.RGBA } ),
			power.createTexture(),
			power.createTexture(),
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA32F, format: gl.RGBA } ),
		] );

		const shadingBuffer = new GLPowerFrameBuffer( gl, { disableDepthBuffer: true } );
		shadingBuffer.setTexture( [
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA16F, format: gl.RGBA } ),
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA16F, format: gl.RGBA } ),
		] );

		const forwardBuffer = new GLPowerFrameBuffer( gl, { disableDepthBuffer: true } );
		forwardBuffer.setDepthTexture( gBuffer.depthTexture );
		forwardBuffer.setTexture( [
			shadingBuffer.textures[ 0 ],
			gBuffer.textures[ 0 ],
			gBuffer.textures[ 1 ],
		] );

		const uiBuffer = new GLPowerFrameBuffer( gl, { disableDepthBuffer: true } );
		uiBuffer.setTexture( [ power.createTexture() ] );

		this.renderTarget = { gBuffer, shadingBuffer: shadingBuffer, forwardBuffer, uiBuffer };

	}

	public resize( resolution: Vector ) {

		this.renderTarget.gBuffer.setSize( resolution );
		this.renderTarget.shadingBuffer.setSize( resolution );
		this.renderTarget.forwardBuffer.setSize( resolution );
		this.renderTarget.uiBuffer.setSize( resolution );

	}

}

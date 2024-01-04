import * as MXP from 'maxpower';
import { Skybox } from '../Entities/Skybox';
import { FluidParticles } from '../Entities/FluidParticles';
import { HUD } from '../Entities/HUD';
import { Floor } from '../Entities/Floor';
import { Logo } from '../Entities/Logo';

export const router = ( node: MXP.BLidgeNode ) => {

	// class

	if ( node.class == "Skybox" ) {

		return new Skybox();

	} else if ( node.class == "Particles" ) {

		return new FluidParticles();

	} else if ( node.class == "GLSLSchool" ) {

		return new Logo();

	} else if ( node.class == "HUD" ) {

		return new HUD();

	} else if ( node.class == "Floor" ) {

		return new Floor();

	}

	const baseEntity = new MXP.Entity();

	return baseEntity;

};

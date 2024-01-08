import path from 'path';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import shaderminifier from './plugins/shader-minifier-loader';

const basePath = process.env.GITHUB_PAGES ? '/glsl-school-2023-sample' : '';

export default defineConfig( {
	root: 'src',
	publicDir: 'public',
	base: basePath,
	server: {
		port: 3000,
		host: "0.0.0.0",
		hmr: {
			reload: true
		}
	},
	build: {
		outDir: '../public/',
		minify: 'terser',
		rollupOptions: {
			input: {
				index: path.resolve( __dirname, 'src/index.html' ),
			},
		}
	},
	resolve: {
		alias: {
			"maxpower": path.join( __dirname, "src/ts/libs/maxpower/" ),
			"glpower": path.join( __dirname, "src/ts/libs/glpower_local/" ),
			"~": path.join( __dirname, "src" )
		},
	},
	plugins: [
		{
			...shaderminifier(),
			enforce: 'pre'
		},
		visualizer( {
			template: "treemap"
		} ),
	],
	define: {
		BASE_PATH: `"${basePath}"`
	}
} );

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

// --------------------------------- wasm for rapier
// wasm and topLevelAwait added for rapier
// https://github.com/viridia/demo-rapier-three
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';


// --------------------------------- deploy on github action
// https://github.com/ErickKS/vite-deploy
// https://github.com/sitek94/vite-deploy-demo
const repo = 'threejs_journey_r3f'

export default defineConfig({
	base: `/${repo}/`,
	plugins: [wasm(), topLevelAwait(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

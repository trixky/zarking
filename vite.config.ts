import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

// wasm and topLevelAwait added for rapier
// https://github.com/viridia/demo-rapier-three
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
	plugins: [wasm(), topLevelAwait(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

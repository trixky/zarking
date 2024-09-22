<!-- ****************************************************** SCRIPT -->
<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { ZarkingGame } from '$lib/game/ZarkingGame';

	let gameCanvas: HTMLCanvasElement | null = null;

	let game: ZarkingGame | null = null;

	async function startGame() {
        game = new ZarkingGame(gameCanvas as HTMLCanvasElement);
		await game.init();
		game.start();
	}

	function unMount() {
		if (game !== null) {
			game.destroy();
		}
	}

	onMount(() => {
		startGame();

		return unMount;
	});
</script>

<!-- ****************************************************** CONTENT -->
<canvas id="game" bind:this={gameCanvas}></canvas>

<!-- ****************************************************** STYLE -->
<style lang="scss">
	#game {
		width: 100%;
		height: 100%;
	}
</style>

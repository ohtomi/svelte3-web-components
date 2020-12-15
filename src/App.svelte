<script>
	import { onDestroy } from "svelte";
	import { createLifeGame } from "./lifegame";

	const ROW_SIZE = 20;
	const COLUMN_SIZE = 20;

	const lifegame = createLifeGame(ROW_SIZE, COLUMN_SIZE);

	// タイマー処理
	let isRunning = false;
	let tickInterval;

	function startTimer() {
		tickInterval = setInterval(() => {
			lifegame.moveNextTick();
		}, 300);
	}

	function stopTimer() {
		clearInterval(tickInterval);
		tickInterval = undefined;
	}

	// ライフゲームが起動されたときにタイマー処理を起動する
	$: if (isRunning && !tickInterval) {
		startTimer();
	}

	// ライフゲームが停止されたときにタイマー処理を止める
	$: if (!isRunning && tickInterval) {
		stopTimer();
	}

	// このコンポーネントが終了するときにタイマー処理を止める
	onDestroy(() => {
		if (tickInterval) {
			stopTimer();
		}
	});
</script>

<style>
	.lifegame-container {
		display: block;
		width: max-content;
	}

	.lifegame-cells-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lifegame-cells {
		display: grid;
		background-color: #333;
		grid-gap: 1px 1px;
		border: solid 1px #333;
	}

	.cell {
		width: 20px;
		height: 20px;
		background-color: #eee;
	}

	.cell.alive {
		background-color: red;
	}

	.lifegame-controller-container {
		margin-top: 5px;
	}
</style>

<svelte:options tag="svelte-lifegame" immutable={true} />

<div class="lifegame-container">
	<div class="lifegame-cells-container">
		<div class="lifegame-cells">
			{#each $lifegame.grid as row, i}
				{#each row as col, j}
					<div
						class="cell"
						class:alive={col.isAlive}
						style="grid-row: {i + 1}"
						on:click={(e) => !isRunning && lifegame.toggle(i, j)} />
				{/each}
			{/each}
		</div>
	</div>
	<div class="lifegame-controller-container">
		{#if !isRunning}
			<button on:click={(e) => (isRunning = true)}>タイマーを動かす</button>
			<button on:click={(e) => lifegame.moveNextTick()}>1ターン進める</button>
			<button on:click={(e) => lifegame.reset()}>リセットする</button>
		{:else}
			<button on:click={(e) => (isRunning = false)}>タイマーを止める</button>
		{/if}
	</div>
</div>

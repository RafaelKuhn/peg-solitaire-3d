<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import gameStatus from '$lib/svelte/GameStatus';

  import Scene from '$lib/three/Scene'
  import EndGamePanel from '$lib/svelte/GameEnd.svelte';

  let canvas: HTMLCanvasElement;
  let scene: Scene;

  const hideEndGamePanel = () => {
    gameStatus.set("isPlaying");
  }

  const dispatch = createEventDispatcher();

  onMount(() => {
    scene = new Scene();
    scene.setupScene(canvas)
      .then(() => dispatch("sceneLoaded"));
  });

  export function restartGame() {
    gameStatus.set("isPlaying");
    scene.restartGame();
  }
  
</script>

<canvas bind:this={canvas}/>


{#if $gameStatus === "hasWon"}
  <EndGamePanel type={"winPanel"} onClick={hideEndGamePanel} />

{:else if $gameStatus === "hasLost" }
  <EndGamePanel type={"lostPanel"} onClick={hideEndGamePanel} />

{/if}
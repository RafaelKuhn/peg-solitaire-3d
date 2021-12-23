<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
</svelte:head>

<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import Scene from '$lib/three/Scene'

  let canvas: HTMLCanvasElement|null = null;
  let scene: Scene|null = null;
   
  const dispatch = createEventDispatcher();

  onMount(() => {
    scene = new Scene();
    scene.loadScene(canvas!)
      .then(() => dispatch("sceneLoaded"));
  })

  export function restartGame() {
    scene!.restartGame();
  }
  
</script>

<canvas bind:this={canvas}/>
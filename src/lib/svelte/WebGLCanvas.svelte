<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import Scene from '$lib/three/Scene'

  let canvas: HTMLCanvasElement;
  let scene: Scene;
   
  const dispatch = createEventDispatcher();

  onMount(() => {
    scene = new Scene();
    scene.loadScene(canvas)
      .then(() => dispatch("sceneLoaded"));
  })

  export function restartGame() {
    scene.restartGame();
  }
  
</script>

<canvas bind:this={canvas}/>
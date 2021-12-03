<svelte:options accessors/>

<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import Scene from '$lib/three/Scene'

  let canvas: HTMLCanvasElement = null;
  export let scene: Scene = null;
  
  const dispatch = createEventDispatcher();

  onMount(() => {
    scene = new Scene();
    scene.loadScene(canvas)
      .then(() => dispatch("sceneLoaded"));
  })
  
</script>

<canvas bind:this={canvas}/>
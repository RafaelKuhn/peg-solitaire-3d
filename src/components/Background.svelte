<svelte:options accessors/>

<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import Scene from '@/javascript/Three/Scene'

  /** @type {HTMLCanvasElement} */ let canvas;
  /** @type {Scene} */ export let scene = null;
  
  const dispatch = createEventDispatcher();

  onMount(() => {
    scene = new Scene();
    scene.loadScene(canvas)
      .then(() => dispatch("sceneLoaded"));
  })
  
</script>

<canvas bind:this={canvas}/>
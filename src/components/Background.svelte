<script>
  import { onMount } from 'svelte'
  
  import Scene from '@/javascript/Three/Scene'

  /** @type {HTMLCanvasElement} */ let canvas;
  /** @type {Scene} */ let scene;

  export let onLoadingEnd;

  onMount(() => {
    scene = new Scene();
    scene.loadScene(canvas)
      .then(() => onLoadingEnd());
  })

  export function startGame() {
    scene.startGame();
  } 
  
  
</script>

<canvas bind:this={canvas}>
</canvas>
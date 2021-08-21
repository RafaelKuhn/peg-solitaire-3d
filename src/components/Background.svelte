<script>
  import { onMount } from 'svelte';
  import Scene from '@/javascript/Three/Scene'
  
  let canvas;
  let scene;
  onMount(() => {
    scene = new Scene();
    scene.startScene(canvas);
  })

  
</script>

<style>
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>

<canvas bind:this={canvas}></canvas>
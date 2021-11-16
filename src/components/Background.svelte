<script>
  import { getContext, onMount } from 'svelte'
  import Scene from '@/javascript/Three/Scene'

  let canvas;

  const modifyTitle = getContext("modifyTitle");

  onMount(() => {
    const scene = new Scene();
    scene.startScene(canvas, modifyTitle);
  })
  
  
</script>

<canvas bind:this={canvas}></canvas>
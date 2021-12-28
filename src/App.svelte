<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
</svelte:head>

<script lang="ts">
  import WebGLCanvas from "$lib/svelte/WebGLCanvas.svelte";
  import TopPanel from '$lib/svelte/TopPanel.svelte';
  import BottomPanel from "$lib/svelte/BottomPanel.svelte";
  import LoadingScreen from "$lib/svelte/LoadingScreen.svelte";

  let background: WebGLCanvas;
  let isLoaded: boolean = false;
  
</script>

<WebGLCanvas bind:this={background} on:sceneLoaded={() => isLoaded = true} />
  
{#if isLoaded}
  <TopPanel />
  
  <BottomPanel on:restartButtonClicked={background.restartGame} />
{:else}
  <LoadingScreen />
{/if}
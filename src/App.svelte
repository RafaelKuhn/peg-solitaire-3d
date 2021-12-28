<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
</svelte:head>

<script lang="ts">
  import WebGLGame from "$lib/svelte/WebGLGame.svelte";
  import TopPanel from '$lib/svelte/TopPanel.svelte';
  import BottomPanel from "$lib/svelte/BottomPanel.svelte";
  import LoadingScreen from "$lib/svelte/LoadingScreen.svelte";

  let game: WebGLGame;
  let isLoading: boolean = true;
  
</script>

<WebGLGame bind:this={game} on:sceneLoaded={() => isLoading = false} />
  
{#if isLoading}
  <LoadingScreen />
{:else}
  <TopPanel />
  <BottomPanel on:restartButtonClicked={game.restartGame} />
{/if}
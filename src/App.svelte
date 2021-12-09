<script lang="ts">
  import Background from "$lib/svelte/Background.svelte";
  import TopPanel from '$lib/svelte/TopPanel.svelte';
  import BottomPanel from "$lib/svelte/BottomPanel.svelte";
  import LoadingScreen from "$lib/svelte/LoadingScreen.svelte";

  let background: Background;
  let isLoaded: boolean = false;
  
</script>

<Background bind:this={background} on:sceneLoaded={() => isLoaded = true} />
  
{#if isLoaded}
  <TopPanel />
  
  <BottomPanel on:resetButtonClicked={background.restartGame} />
{:else}
  <LoadingScreen />
{/if}
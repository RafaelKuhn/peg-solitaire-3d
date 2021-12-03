<script lang="ts">
  import Background from "$lib/svelte/Background.svelte";
  import TopPanel from '$lib/svelte/TopPanel.svelte';
  import BottomPanel from "$lib/svelte/BottomPanel.svelte";

  let background: Background;
  /** @type {boolean} */ let isLoaded = false;
</script>

<Background on:sceneLoaded={() => isLoaded = true} bind:this={background} />
  
{#if isLoaded}
  <TopPanel />
  
  <BottomPanel on:playButtonClicked={() => background.scene.startGame()} />
{/if}
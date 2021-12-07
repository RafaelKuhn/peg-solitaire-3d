<script lang="ts">
  import Background from "$lib/svelte/Background.svelte";
  import TopPanel from '$lib/svelte/TopPanel.svelte';
  import BottomPanel from "$lib/svelte/BottomPanel.svelte";
  import LoadingScreen from "$lib/svelte/LoadingScreen.svelte";

  let background: Background;
  let isLoaded: boolean = false;

  $: console.log("loaded? "+isLoaded);
  
</script>

<Background on:sceneLoaded={() => isLoaded = true} bind:this={background} />
  
{#if isLoaded}
  <TopPanel />
  
  <BottomPanel on:playButtonClicked={ background.startGame } />
{:else}
  <LoadingScreen />
{/if}
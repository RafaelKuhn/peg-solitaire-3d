<script>
  import Background from "@/components/Background.svelte";
  import TopPanel from '@/components/TopPanel.svelte';
  import BottomPanel from "./components/BottomPanel.svelte";

  /** @type {Background} */ let background;
  /** @type {boolean} */ let isLoaded = false;
</script>


<TopPanel />
<Background on:sceneLoaded={() => isLoaded = true} bind:this={background} />
 
{#if isLoaded}
  <BottomPanel on:playButtonClicked={() => background.scene.startGame()} />
{/if}
<script>
  import Background from "@/components/Background.svelte";
  import TopPanel from '@/components/TopPanel.svelte';
import BottomPanel from "./components/BottomPanel.svelte";

  // TODO: make it call child function instead of this mess
  // setContext(contextKeys.functions.END_LOADING_SCREEN, endLoading);

  /** @type {Background} */ let background;
  
  let isLoaded = false;
  function setIsLoaded() {
    isLoaded = true;
  }
  // let isLoaded = background.isLoaded;

</script>


<TopPanel />
<Background bind:this={background} onLoadingEnd={setIsLoaded} />

{#if isLoaded}
  <BottomPanel onPlayButtonClick={background.startGame} />
{/if}
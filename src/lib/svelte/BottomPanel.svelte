<script>
  import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();
  /** @type {HTMLButtonElement}*/ let button;
</script>

<style>
  background {
    position: absolute;
    margin: auto;
    min-width: 600px;
    right: 15%;
    left: 15%;

    text-align: center;

    background-color: transparent;
    height: 20%;
    bottom: 0;
  }

  button {
    margin: 0;
    padding: 0;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%
  }

  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>

<background class="flex">
  
  <h2>botão do sofrimento...</h2>
  
  <button bind:this={button} on:click|once={() => { dispatch("playButtonClicked"); button.style.cursor = "default" }}>
    <img src="https://www.pngfind.com/pngs/m/427-4277341_add-play-button-to-image-online-overlay-play.png"
    alt="play button" />
  </button>

</background>
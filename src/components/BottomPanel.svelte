<script>
  import "@/style/background.css";

  export let onPlayButtonClick;

</script>

<style>

  h2 {
    color: aliceblue;
  }

  background {
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
  
  <button on:click|once={onPlayButtonClick}>    
    <img src="https://www.pngfind.com/pngs/m/427-4277341_add-play-button-to-image-online-overlay-play.png"
    alt="play button" />
  </button>
</background>
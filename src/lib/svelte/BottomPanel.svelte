<style>
  div {
    position: absolute;
    margin: auto;
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
    width: 120px;
    height: 120px;
    
    cursor: pointer;
    outline: none;
    border: none;
    background-color: transparent;

    /* background:  */
    background-image: url("/static/images/restart-button2.png");
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;

    /* animation */
    transition: all .1s ease-out;
  }

  button:hover {
    transform: scale(1.04);
  }

  button:active {
    transition: none;
    /* TODO: make images base64 for instant reloading */
    background-image: url("/static/images/restart-button.png");
    background-color: transparent;
    border-color: transparent;
  }

  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

</style>

<script>
  import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();
</script>

<div class="flex">
    
  <button on:click={() => dispatch("resetButtonClicked")} />

</div>
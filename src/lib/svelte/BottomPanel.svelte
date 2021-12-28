<style>
  div {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    right: 15%;
    left: 15%;

    text-align: center;

    background-color: transparent;
    bottom: 0;
  }

  button {
    margin: 0;
    padding: 0;
    width: 20vh;
    height: 20vh;
    
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

  button.hoverable:hover {
    transform: scale(1.04);
  }

  /* button:hover {
    transform: scale(1.04);
  } */

  button:active {
    transition: none;
    /* TODO: find a way to precache url("shit") so it flickers instantly when clicked */
    background-image: url("/static/images/restart-button.png");
    background-color: transparent;
    border-color: transparent;
  }

</style>

<script>
  import { Utils } from "$lib/svelte/Utils";
  import { createEventDispatcher } from "svelte";
  
  let isDesktop = !Utils.IsMobile;

  const dispatch = createEventDispatcher();
</script>

<div>
    
  <button on:click={() => dispatch("restartButtonClicked")} class:hoverable={isDesktop} />

</div>
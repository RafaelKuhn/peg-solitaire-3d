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
    background-image: url("/static/images/restart-button.png");
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;

    /* animation */
    transition: all .1s ease-out;
  }

  button.hoverable:hover {
    transform: scale(1.04);
  }

  button:active {
    transition: none;
    background-image: url("/static/images/restart-button-clicked.png");
    background-color: transparent;
    border-color: transparent;
  }

</style>

<script lang="ts">
	import { createEventDispatcher } from "svelte";
  import BrowserData from "$lib/svelte/BrowserData";
  
  // this weird stuff preloads clicked button background
  (new Image()).src = "/static/images/restart-button-clicked.png";

  let isDesktop = !BrowserData.IsMobile;

  const dispatch = createEventDispatcher();

</script>

<div>
    
  <button on:click={() => dispatch("restartButtonClicked")} class:hoverable={isDesktop} />

</div>
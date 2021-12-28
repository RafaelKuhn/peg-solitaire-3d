<style>

  :root {
    --panel-width: 70vw;
    --panel-height: 45vh;
  }

  winPanel, lostPanel {
    /* position */
    position: absolute;
    max-width: 500px;
    width: var(--panel-width);
    left: 50%;
    height: var(--panel-height);
    top: 50%;
    transform: translate(max(calc(var(--panel-width) / -2), -250px), calc(var(--panel-height) / -2));

    /* style */
    border-radius: 4vh;

    /* elements */
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
  }

  winPanel {
    background-color: rgba(0, 128, 0, 0.8);
  }
  
  lostPanel {
    background-color: rgba(255, 0, 0, 0.8);
  }

  h1, h2 {
    margin: 0;
  }

  h1 {
    font-size: 14vh;
  }

  h2 {
    font-size: 3.5vh;
  }

</style>

<script lang="ts">
  import { Utils } from "$lib/svelte/Utils";

  type PanelType = "lostPanel" | "winPanel";
  export let type: PanelType;
</script>


{#if type === "winPanel"}
  <winPanel class="{Utils.IsMobile ? 'mobilePanel' : 'desktopPanel'}">
    <h1>🥳</h1>
    <h2>Você ganhou!</h2>
  </winPanel>

{:else if type === "lostPanel"}
  <lostPanel class="{Utils.IsMobile ? 'mobilePanel' : 'desktopPanel'}">
    <h1>😢</h1>
    <h2>Você perdeu!</h2>
  </lostPanel>

{/if}
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
    border-radius: 2vh;

    /* elements */
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
  }

  winPanel { background-color: rgba(0, 128, 0, 0.8); }
  lostPanel { background-color: rgba(255, 0, 0, 0.8); }

  h1, h2 { margin: 0; }
  h1 { font-size: 14vh; }
  h2 { font-size: 3.5vh; }

  button {
    border: none;
		margin: none;
    padding: 15px 32px;

    background: black;
    color: white;
    cursor: pointer;
    text-align: center;
    text-decoration: none;

    transition: background 0.05s ease-in;
		font-size: 1em;
  }

  button:hover {
    background: rgb(54, 54, 54);
  }

  button:active { background: rgb(126, 126, 126); }

</style>

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Utils } from "$lib/svelte/Utils";

  let panelClass = Utils.IsMobile ? 'mobilePanel' : 'desktopPanel';

	const fadeConfig = { duration: 150 }

  type PanelType = "lostPanel" | "winPanel";
  export let type: PanelType;
  export let onClick: () => void;
</script>



{#if type === "winPanel"}
	<winPanel class="{panelClass}" on:click={onClick} transition:fade={fadeConfig}>
		<h1>🥳</h1>
		<h2>Você ganhou!</h2>
		<p><button on:click={onClick}>Daora!</button></p>
	</winPanel>

{:else if type === "lostPanel"}
	<lostPanel class="{panelClass}" on:click={onClick} transition:fade={fadeConfig}>
		<h1>😢</h1>
		<h2>Você perdeu!</h2>
		<button on:click={onClick}>Ok...</button>
	</lostPanel>

{/if}

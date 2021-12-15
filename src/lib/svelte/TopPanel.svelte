<script>
  import { pageTitle } from '$lib/svelte/Stores';
</script>

<style>
  background {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    right: 15%;
    left: 15%;
    height: 10vh;

    text-align: center;

    top: 0;
    background-color: #720b98bd;
    border-bottom-left-radius: 4vh;
    border-bottom-right-radius: 4vh;
  }

  h2 {
    margin: 0;
    /* height: 3.5vh; */
    font-size: 3.5vh;
  }
</style>


<background>
  <h2>{$pageTitle.text}</h2>
</background>
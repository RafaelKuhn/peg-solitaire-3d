<style>
  background {
    position: absolute;
    margin: auto;
    min-width: 600px;
    right: 15%;
    left: 15%;

    text-align: center;

    top: 0;
    background-color: #720b98bd;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
</style>

<script>
  import { pageTitle } from '$lib/svelte/Stores';
</script>

<background>
  <h2>{$pageTitle.text}</h2>
</background>
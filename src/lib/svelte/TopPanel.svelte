<script>
  import { pageTitle } from '$lib/svelte/Stores';
</script>

<style>
  background {
    position: absolute;
    margin: auto;
    right: 15%;
    left: 15%;

    text-align: center;

    top: 0;
    background-color: #720b98bd;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
</style>


<background>
  <h2>{$pageTitle.text}</h2>
</background>
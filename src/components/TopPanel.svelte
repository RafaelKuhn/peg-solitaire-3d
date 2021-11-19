<style>
  background {
    top: 0;
    background-color: #720b98bd;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
</style>

<script>
  import { pageTitle } from '@/javascript/Svelte/Stores';
</script>

<background>
  <h2>{$pageTitle}</h2>
</background>
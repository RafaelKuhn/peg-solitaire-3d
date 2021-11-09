<script>
  import { setContext } from 'svelte';
  import Background from "@/components/Background.svelte";

  let title = "Carregando...";
  
  const modifyTitle = input => title = input;
  const endLoading = input => {
    modifyTitle(input);
    modifyTitle("Resta um 🎮🎲")
  }

  setContext("modifyTitle", endLoading);

</script>

<style>
  
  h2 {
    color: white;
  }

  page {
    position: absolute;
    margin: auto;
    min-width: 600px;
    top: 0;
    right: 15%;
    left: 15%;

    background-color: #720b9880;
    text-align: center;
    
    pointer-events: none;
  }
</style>


<Background />

<page>
  <h2>{title}</h2>
</page>
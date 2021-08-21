<script>
  import Background from "@/components/Background.svelte";
</script>

<!--
  TODO: move this to another component
-->
<style>
  
  h2 {
    color: white;
  }

  page {
    position: absolute;
    margin: auto;
/*    height: 100%; */
    right: 15%;
    left: 15%;

    background-color: #720b9880;
    text-align: center;
    
    pointer-events: none;
  }

  @media (min-width: 640px) {
    page {
      max-width: none;
    }
  }
</style>


<Background />

<page>
  <h2>Resta um dos irmão 😎</h2>
</page>
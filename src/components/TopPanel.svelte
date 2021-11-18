<script>
  import "@/style/background.css";
  import { pageTitle } from "@/javascript/Svelte/Stores";

  let title = '';
  pageTitle.subscribe(newTitle => title = newTitle);
</script>

<style>
  h2 {
    color: aliceblue;
  }
  
  background {
    background-color: #720b98bd;
    top: 0;
    /* border-radius: 0, 0, 30px, 30px; */
     border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
</style>

<background>
  <h2>{title}</h2>
</background>
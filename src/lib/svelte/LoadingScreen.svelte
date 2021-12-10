<script>

  import { Utils } from "./Utils";

  let isMobile = Utils.isMobile();

</script>

<style>
  abs {
    position: absolute;
    left: 0;
    top: 0;

    width: 100%;
    height: 100%;
  }

  flex {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    flex-direction: column;
  }
  
  h2 {
    bottom: 0.3em;
    position: absolute;
    z-index: 1;
  }

  img {
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;  
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;

    object-fit: cover;
    object-position: 48% 0px;
    
    animation-name: rotate-the-cat;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.07, 1, 0.07, 1);
  }

  .img-mobile {
    width: 200px;
    height: 200px;
  }

  .img {
    width: 500px;
    height: 500px;
  }

  @keyframes rotate-the-cat {
    0%, 100% {
      transform: rotate(0deg) scale(0.8);
    }
    50% {
      transform: rotate(360deg) scale(1.3);;
    }
  }

</style>

<abs>
  <flex>
    <img
      src="static/images/loading-cat.gif"
      alt="a loading cat funny gif"
      class="{isMobile ? 'img-mobile' : 'img'}"
    />
    <h2>Loading...</h2>
  </flex>
</abs>

<script>

  function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  let isMobile = detectMobile();

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
    z-index: 1;
  }

  img {
    border-radius: 50%;

    object-fit: cover;
    object-position: 48% 0px;
    
    /* transform: */
    animation-name: rotate-the-cat;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
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
      src="static/loading-cat.gif"
      alt="a loading cat funny gif"
      class:img-mobile={isMobile}
      class:img={!isMobile}
    />
    <h2>Loading...</h2>

  </flex>
</abs>
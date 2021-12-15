export default function autoResize(sizes, camera, renderer) {
  function resize() {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const ratio = window.innerHeight/window.innerWidth;
    camera.fov = ratio < 1.4 ? 45 : 60;
  }

  window.addEventListener('resize', resize);
  resize();
  window.dispatchEvent(new Event('resize'));
}
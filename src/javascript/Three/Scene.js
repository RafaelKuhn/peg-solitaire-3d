import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { gsap } from 'gsap';
import * as datgui from 'dat.gui';

import Resources from '@/javascript/Three/Resources';
import Ticker from '@/javascript/Three/Ticker';
import { autoResize } from "@/javascript/Three/AutoResize";

import { TeapotGeometry } from '@/javascript/Three/Geometries/TeapotGeometry';


const TAU = 6.283185;
const HALF_TAU = TAU * 0.5;
const anEighth = 0.125;

export default class {

  async startScene(canvas, onLoadingScreenEnd) {
    const isDebugMode = window.location.hash === "#debug";

    const scene = new THREE.Scene();

    // Lights
    const ambient = new THREE.AmbientLight( 0xffffff, 0.5 )
    scene.add(ambient)

    const directional = new THREE.DirectionalLight( 0xeeeeff, 0.9 )
    directional.position.z -= 3
    directional.position.y += 2
    scene.add(directional)

    if (isDebugMode) {
      const directionalHelper = new THREE.DirectionalLightHelper(directional);
      scene.add(directionalHelper)
      let lightHelper = new THREE.AxesHelper(0.5)
      lightHelper.position.add(directional.position)
      scene.add(lightHelper)
    }

    // Data
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    const pointer = {
      x: 0,
      y: 0
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 2000)
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    const render = () => renderer.render(scene, camera);

    // Adjust sizes, camera and renderer based on viewport dimensions
    autoResize(sizes, camera, renderer);

    // Animate
    const ticker = new Ticker();
    ticker.addOnTickEvent(render);
    ticker.tick();


    // Loading screen
    camera.position.set(6, 4, 0);
    camera.lookAt(new THREE.Vector3(0, 2, 0));

    const teapot = new THREE.Mesh(
      new TeapotGeometry(1),
      new THREE.MeshStandardMaterial({ color: 0xe06940 })
    )
    teapot.rotation.set(0, 0.25 * TAU, 0);
    teapot.position.set(0, 2, 0)
    scene.add(teapot);
  
    const buffgeoBack = new THREE.IcosahedronBufferGeometry(10,2);
    const back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial({
      map: gradTexture([[0.75,0.6,0.4,0.25], ['#00111a', '#4b5f7f', '#34726e', '#34726e', ]]),
      side:THREE.BackSide,
      depthWrite: false,
      fog:false
    }));
    scene.add( back );
    // end loading screen

    // Resources
    // TODO: use loading screen class
    const resources = new Resources(
      (progress) => console.log(`loading ${progress}`)
    );

    await resources.loadResources();
    console.log("resources finished loading");



    // clean loading screen
    teapot.geometry.dispose();
    teapot.material.dispose();
    scene.remove(teapot);
    back.geometry.dispose();
    back.material.dispose();
    scene.remove(back);
    
    onLoadingScreenEnd();
    // loading screen clean end




    
    scene.background = resources.items["skybox"];
    
    camera.position.set(9.8, 9.5, 5.2);


    if (isDebugMode) {
      const controls = new OrbitControls(camera, canvas);
    }
    
    // else { const controls = new OrbitControls(camera, canvas); }
    
    
    window.addEventListener("mousemove", (evt) => {
      // pointer will go from -0.5 to 0.5 screen space
      pointer.x = (evt.clientX / sizes.width) - 0.5;
      pointer.y = - ((evt.clientY / sizes.height) - 0.5);
    })



    // position elements
    let boardTemplate = [
      0, 0, 1, 1, 1, 0, 0,
      0, 0, 1, 1, 1, 0, 0,
      1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 0, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1,
      0, 0, 1, 1, 1, 0, 0,
      0, 0, 1, 1, 1, 0, 0,
    ];

    /** @type {THREE.Group} */
    const rootBoard = resources.items["board"].scene;
    scene.add(rootBoard);
    rootBoard.traverse(obj => {
      if (obj.type === "Mesh") {
        // obj.material = new THREE.MeshMatcapMaterial({ matcap: resources.items["skyMatcap"] });
        // obj.material = new THREE.MeshStandardMaterial({ });

      }
    })

    /** @type {THREE.Group} */
    const rootPiece = resources.items["piece"].scene;
    
    for (let i = 0; i<7; i++) {
      for (let j = 0; j<7; j++) {
        const index = i*7+j;
        if (boardTemplate[index]) {
          const x = i-3;
          const z = j-3;
          rootPiece.position.set(x, 0, z);
          scene.add(rootPiece.clone())
        }
      }
    }
    

    // Debug
    if (isDebugMode) {
      const helper = new THREE.AxesHelper(100);
      scene.add(helper);
    }
  }

}
// "Resta um 🎮🎲"




function gradTexture(color) {
  var c = document.createElement("canvas");
  var ct = c.getContext("2d");
  var size = 1024;
  c.width = 16; c.height = size;
  var gradient = ct.createLinearGradient(0,0,0,size);
  var i = color[0].length;
  while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
  ct.fillStyle = gradient;
  ct.fillRect(0,0,16,size);
  var texture = new THREE.Texture(c);
  texture.needsUpdate = true;
  return texture;
}  




function addOnClickTwistAnimation(mesh) {
  let isRotating = false;
  window.addEventListener("click", async () => {
    if (isRotating) return;

    const startRot = mesh.rotation.z;
    const totalDuration = 1.5;
    isRotating = true;
    const newRot = - (mesh.rotation.z + TAU * anEighth);
    await gsap.to(mesh.rotation, {
      z: newRot,
      duration: totalDuration * 0.2,
      ease: "expo"
    })
    
    await gsap.to(mesh.rotation, {
      z: startRot,
      duration: totalDuration * 0.5,
      ease: "bounce.out"
    })
    
    isRotating = false;
  });
}


function addOnClickBouncyAnimation(mesh) {
  let isJumping = false;
  window.addEventListener("click", async () => {
    if (isJumping) return;

    const startPos = mesh.position.y;
    const totalDuration = 1;
    isJumping = true;
    const newPos = mesh.position.y + 5;
    
    await Promise.all([
      await gsap.to(mesh.position, {
        y: newPos,
        duration: totalDuration * 0.25,
        ease: "sine"
      }),
      
      gsap.to(mesh.position, {
        y: startPos,
        duration: totalDuration * 0.5,
        ease: "bounce.out"
      }),

      gsap.to(mesh.scale, {
        y: 1,
        x: 1,
        z: 1,
        duration: totalDuration * 0.5,
        ease: "bounce.out"
      }),

    ]);
    
    isJumping = false;
  });
}



import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { gsap } from 'gsap';

import Resources from '@/javascript/Three/Resources';
import Ticker from '@/javascript/Three/Ticker';

import { autoResize } from "@/javascript/Three/AutoResize";

import { TeapotGeometry } from './Geometries/TeapotGeometry';

const TAU = 6.283185;
const HALF_TAU = TAU * 0.5;
const anEighth = 0.125;

export default class {

  async startScene(canvas) {
    const scene = new THREE.Scene();

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 1, 1);
    scene.add(
      new THREE.AmbientLight(0xffffff, 1),
      pointLight
    )
    

    // All part of the loading screen
    const teapot = new THREE.Mesh(
      new TeapotGeometry(),
      new THREE.MeshToonMaterial({ color: 0x7707f7 })
    )
    //teapot.rotation.y = anEighth * TAU;
    teapot.scale.set(0.02, 0.02, 0.02)
    teapot.position.set(0, 2, 0)
    scene.add(teapot);
    

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
    const cameraOrigin = new THREE.Vector3(2,5,10);
    const cameraFocus = new THREE.Vector3(0, 2, 0);
    const cameraDistance = cameraOrigin.distanceTo(cameraFocus);
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 2000)
    camera.position.set(cameraOrigin.x, cameraOrigin.y, cameraOrigin.z);
    camera.lookAt(cameraFocus);
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const render = () => renderer.render(scene, camera);


    // Adjust sizes, camera and renderer based on viewport dimensions
    autoResize(sizes, camera, renderer);

    // Animate
    const ticker = new Ticker();
    ticker.addOnTickEvent(render);
    ticker.tick();



    // Resources
    // TODO: use loading screen class
    const resources = new Resources(
      (progress) => console.log(`loading ${progress}`)
    );

    await resources.loadResources();

    console.log("resources finished loading");
    

    scene.background = resources.items["skybox"];

    teapot.geometry.dispose();
    teapot.material.dispose();
    scene.remove(teapot);
    // loading screen end

    
    // Controls
    const controls = new OrbitControls(camera, canvas);
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

    const rootBoard = resources.items["board"].scene;
    scene.add(rootBoard.clone());

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
    const helper = new THREE.AxesHelper(100);
    scene.add(helper);
    
    // const meshHelper = new THREE.AxesHelper(1);
    // meshHelper.position.add(mesh.position);
    // meshHelper.rotation.setFromVector3(mesh.rotation);
    // scene.add(meshHelper);
    
  }

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

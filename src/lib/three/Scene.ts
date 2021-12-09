import * as THREE from 'three';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Resources from '$lib/three/Resources';
import Ticker from '$lib/three/Ticker';
import autoResize from "$lib/three/AutoResize";
import Board from "$lib/three/Board";

import { pageTitle } from "$lib/svelte/Stores";
import { Utils } from '$lib/svelte/Utils';

const TAU = 6.283185;
const HALF_TAU = TAU * 0.5;
const AN_EIGTH = 0.125;

export default class {

  isDebugMode: Boolean = false;

  boardTemplate: Array<Array<number>>;
  board: Board;

  constructor() {
    this.boardTemplate = [
      [2, 2, 1, 1, 1, 2, 2],
      [2, 2, 1, 1, 1, 2, 2],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [2, 2, 1, 1, 1, 2, 2],
      [2, 2, 1, 1, 1, 2, 2],
    ];    
  } 

  async loadScene(canvas) {

    this.isDebugMode = window.location.hash === "#debug";
    pageTitle.update(() => ({ text: "Carregando..." }));

    const scene = new THREE.Scene();

    // Lights
    const ambient = new THREE.AmbientLight( 0xffffff, 0.5 );
    scene.add(ambient);

    const directional = new THREE.DirectionalLight( 0xeeeeff, 0.9 );
    directional.position.z -= 3;
    directional.position.y += 2;
    scene.add(directional);

    // Data
    const viewportSize = { width: window.innerWidth, height: window.innerHeight }
    const mousePosition = { x: 0, y: 0 }
    window.addEventListener("mousemove", (evt) => {
      // cursor will go from 0 to 1.0 screen space
      mousePosition.x = (evt.clientX / viewportSize.width)
      mousePosition.y = 1 - ((evt.clientY / viewportSize.height));
    })

    // Camera
    const camera = new THREE.PerspectiveCamera(45, viewportSize.width / viewportSize.height, 0.1, 2000)
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
    
    // Adjust sizes, camera and renderer based on viewport dimensions
    autoResize(viewportSize, camera, renderer);
    
    // Tick functions
    const ticker = new Ticker();
    const render = () => renderer.render(scene, camera);
    ticker.addOnTickEvent(render);
    ticker.tick();


    

    // TODO: loading screen abstraction
    // Loading screen
    camera.position.set(6, 4, 2); // z 0
    camera.lookAt(new THREE.Vector3(0, 2, 0));
  
    const back: THREE.Mesh = new THREE.Mesh(
      new THREE.IcosahedronBufferGeometry(10,2),
      new THREE.MeshBasicMaterial({
        map: gradientTexture([[0.75,0.6,0.4,0.25], ['#00111a', '#4b5f7f', '#34726e', '#34726e']]),
        side:THREE.BackSide,
        depthWrite: false,
        fog:false
      })
    );

    scene.add( back );
    // end loading screen


    // Resources
    const resources = new Resources(
      progress => console.log(`loading ${progress}`)
    );

    // return Promise.reject();
    await resources.loadResources();



    // clean loading screen
    back.geometry.dispose();
    (back.material as THREE.MeshBasicMaterial).dispose();
    scene.remove(back);
    
    pageTitle.update(() => ({ text: "Resta Um 🎮🎲"}));
    // clean loading screen end

    // post loading screen
    scene.background = resources.items["skybox"];
    camera.position.set(9.61, 7.76, 4.35);
    const sceneFocus = new THREE.Vector3(0, -2, 0);
    camera.lookAt(sceneFocus);
    // post loading screen end



    const rootBoard = resources.items["board"].scene;
    const rootPiece = resources.items["piece"].scene;
    
    this.board = new Board(scene, rootPiece, rootBoard);
    this.board.setupPieces(this.boardTemplate);

    // Debug
    if (this.isDebugMode) {
      const controls = new OrbitControls(camera, canvas);
      // controls.target = sceneFocus;
      controls.update();

      const gui = new dat.GUI();

      const helper = new THREE.AxesHelper(100);
      scene.add(helper);
      
      const directionalHelper = new THREE.DirectionalLightHelper(directional);
      scene.add(directionalHelper)
      let lightHelper = new THREE.AxesHelper(0.5)
      lightHelper.position.add(directional.position)
      scene.add(lightHelper);
      
      // const updateBg = (obj) =>
      // (back.material as THREE.MeshBasicMaterial).map = gradientTexture([[obj.st1, obj.st2, obj.st3], [obj.c1, obj.c2, obj.c3]])

      // const helperObj = {
      //   st1: 0.75,
      //   st2: 0.6,
      //   st3: 0.4,
      //   c1: '#00111a',
      //   c2: '#4b5f7f',
      //   c3: '#34726e',
      // }

      // gui.add(helperObj, "st3").min(0).max(1).step(0.01).onChange(() => updateBg(helperObj));
      // gui.add(helperObj, "st2").min(0).max(1).step(0.01).onChange(() => updateBg(helperObj));
      // gui.add(helperObj, "st1").min(0).max(1).step(0.01).onChange(() => updateBg(helperObj));

      // gui.addColor(helperObj, "c3").onChange(() => updateBg(helperObj));
      // gui.addColor(helperObj, "c2").onChange(() => updateBg(helperObj));
      // gui.addColor(helperObj, "c1").onChange(() => updateBg(helperObj));
    }
  }

  restartGame() {
    console.log("game restart");
  }


}

// TODO: pensar alternativa pra esse cursed gambiarra code
function gradientTexture(colorStopMatrix) {
  var c = document.createElement("canvas");
  var ct = c.getContext("2d");
  var size = 1024;
  c.width = 16; c.height = size;
  var gradient = ct.createLinearGradient(0,0,0,size);
  var i = colorStopMatrix[0].length;
  while(i--) { gradient.addColorStop(colorStopMatrix[0][i],colorStopMatrix[1][i]); }
  ct.fillStyle = gradient;
  ct.fillRect(0,0,16,size);
  var texture = new THREE.Texture(c);
  texture.needsUpdate = true;
  return texture;
}
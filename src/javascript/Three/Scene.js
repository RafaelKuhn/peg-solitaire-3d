import * as THREE from 'three';
import { gsap } from 'gsap';
import * as dat from 'dat.gui';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import Resources from '@/javascript/Three/Resources';
import Ticker from '@/javascript/Three/Ticker';
import autoResize from "@/javascript/Three/AutoResize";
import Board from "@/javascript/Board";

import { TeapotGeometry } from '@/javascript/Three/Geometries/TeapotGeometry';

import * as Stores from "@/javascript/Svelte/Stores";

const TAU = 6.283185;
const HALF_TAU = TAU * 0.5;
const AN_EIGTH = 0.125;

export default class {

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

    const isDebugMode = window.location.hash === "#debug";

    Stores.pageTitle.update(() => "Carregando...");

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
      mousePosition.x = (evt.clientX / viewportSize.width)// - 0.5;
      mousePosition.y = 1 - ((evt.clientY / viewportSize.height))// - 0.5);

      // cursor will go from -0.5 to 0.5 screen space
      // mousePosition.x = (evt.clientX / viewportSize.width) - 0.5;
      // mousePosition.y = - ((evt.clientY / viewportSize.height) - 0.5);
    })

    // Camera
    const camera = new THREE.PerspectiveCamera(45, viewportSize.width / viewportSize.height, 0.1, 2000)
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
    
    // Adjust sizes, camera and renderer based on viewport dimensions
    autoResize(viewportSize, camera, renderer);
    
    // Animate
    const ticker = new Ticker();
    const render = () => renderer.render(scene, camera);
    ticker.addOnTickEvent(render);
    ticker.tick();


    // TODO: loading screen abstraction
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
      map: gradientTexture([[0.75,0.6,0.4,0.25], ['#00111a', '#4b5f7f', '#34726e', '#34726e']]),
      side:THREE.BackSide,
      depthWrite: false,
      fog:false
    }));
    scene.add( back );
    // end loading screen

    // Resources
    const resources = new Resources(
      isDebugMode ? progress => console.log(`loading ${progress}`) : null
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
    
    Stores.pageTitle.update(() => "Resta Um - Força Bruta 🎮🎲");
    // clean loading screen end

    // post loading screen
    scene.background = resources.items["skybox"];
    camera.position.set(9.61, 7.76, 4.35);
    const sceneFocus = new THREE.Vector3(0, -2, 0);
    camera.lookAt(sceneFocus);
    // post loading screen end




    const rootBoard = resources.items["board"].scene;
    const rootPiece = resources.items["piece"].scene;
    
    /** @type {Board} */
    this.board = new Board(scene, rootPiece, rootBoard);
    this.board.setupPieces(this.boardTemplate);

    ticker.addOnTickEvent( () => {
      const speed = 0.003;// 60 * 0.003 * ticker.getDeltaTime();
      this.board.boardObj.rotateY(speed)
      this.board.piecesObj.rotateY(speed)
    })

    // Debug
    if (isDebugMode) {
      const controls = new OrbitControls(camera, canvas);
      controls.target = sceneFocus;
      controls.update();

      const gui = new dat.GUI();

      const helper = new THREE.AxesHelper(100);
      scene.add(helper);
      
      const directionalHelper = new THREE.DirectionalLightHelper(directional);
      scene.add(directionalHelper)
      let lightHelper = new THREE.AxesHelper(0.5)
      lightHelper.position.add(directional.position)
      scene.add(lightHelper)
      
      gui.add(camera.position, "x").min(0).max(20);
      gui.add(camera.position, "y").min(0).max(20);
      gui.add(camera.position, "z").min(0).max(20); 
    }
  }

  startGame() {
    this.board.movePiece(3, 1, 3, 3);
    this.board.movePiece(1, 2, 3, 2);
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
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';

import Resources from '$lib/three/Resources';
import Ticker from '$lib/three/Ticker';
import BoardLogic from "$lib/three/BoardLogic";
import LoadingScreen from "$lib/three/LoadingScreen";

import autoResize from "$lib/three/AutoResize";

import { pageTitle } from "$lib/svelte/Stores";
import { Utils } from '$lib/svelte/Utils';

const TAU = 6.283185;
const HALF_TAU = TAU * 0.5;
const AN_EIGTH = 0.125;

export default class {

  // threejs logic
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private ticker: Ticker;
  
  // game logic
  private loadingScreen?: LoadingScreen;
  private boardLogic: BoardLogic;
  
  // TODO: change these to another place, like 'browserData' to replace "Utils bad class"
  private mousePosition: THREE.Vector2;
  private viewport: Viewport;
  private isDebugMode: Boolean = false;


  // TODO: raycaster wrapper class
  private onRayCast: OptionalCallback<THREE.Vector3> = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.viewport = { width: window.innerWidth, height: window.innerHeight }
    this.camera = new THREE.PerspectiveCamera(45, this.viewport.width / this.viewport.height, 0.1, 2000);

    this.mousePosition = new THREE.Vector2(2000, 2000);

    this.ticker = new Ticker();
  } 

  public async loadScene(canvas: HTMLCanvasElement) {

    this.isDebugMode = window.location.hash === "#debug";
    pageTitle.update(() => ({ text: "Carregando..." }));

    this.setupLights();

    // Data
    window.addEventListener("mousemove", (evt) => {
      // cursor will go from 0 to 1.0 screen space
      this.mousePosition.x = evt.clientX/this.viewport.width * 2 - 1;
      this.mousePosition.y = (1-evt.clientY/this.viewport.height) * 2 - 1;
    })

    this.scene.add(this.camera)

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })
  
    const onTick = () => {
      renderer.render(this.scene, this.camera)
    }

    // TODO: put this in browserData class
    autoResize(this.viewport, this.camera, renderer);

    this.ticker.pushOnTickEvent(onTick);
    this.ticker.tick();

    const loadingScreen = new LoadingScreen(this.camera, this.scene);
    loadingScreen.show();

    const resources = new Resources(() => null);
    await resources.loadResources();

    loadingScreen.dispose();
    pageTitle.update(() => ({ text: "Resta Um 🎮🎲"}));

    this.scene.background = resources.items["skybox"];
    this.camera.position.set(10.571, 8.536, 4.785);
  
    const sceneFocus = new THREE.Vector3(0, -2, 0);
    this.camera.lookAt(sceneFocus);

    const rootBoard = resources.items["board"].scene;
    const rootPiece = resources.items["piece"].scene;
    
    this.boardLogic = new BoardLogic(this.scene, rootPiece, rootBoard);
    this.boardLogic.setupPieces();

    this.setupRaycaster();

    // // do movement
    // this.boardLogic.movePiece(3, 1, 3, 3)
    // this.boardLogic.putPieceAside(3, 2);

    // // undo movement
    // this.boardLogic.putPieceBack(3, 2);
    // this.boardLogic.movePiece(3, 3, 3, 1)


    const movablePieces = this.boardLogic.getMovablePieces();
    movablePieces.forEach(piece => this.boardLogic.colorPieceAsMovable(piece))

    this.onRayCast = hit => {
      this.boardLogic.colorPiecesAsMovable(movablePieces);

      const closest = this.boardLogic.getClosestPiece(hit, movablePieces);
      if (closest) {
        this.boardLogic.colorPieceAsHovered(closest);
      }
    }

    // add listener on mouse up, makes the play at closest 


    // Debug
    if (this.isDebugMode) {
      const helper = new THREE.AxesHelper(100);
      this.scene.add(helper);
    }
  }

  public restartGame() {
    console.log("game restart");
  }


  private setupRaycaster() {
    const caster = new THREE.Raycaster();

    const planeRaycastObject = this.createRaycastPlane();

    let hits: THREE.Intersection<THREE.Object3D<THREE.Event>>[];

    let doRaycast: () => void;

    if (this.isDebugMode) {
      const normalMaterial = new THREE.MeshNormalMaterial({ normalMapType: THREE.TangentSpaceNormalMap, wireframe: true });
      planeRaycastObject.material = normalMaterial;

      const ball = new THREE.Mesh(new THREE.SphereBufferGeometry(0.1, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      this.scene.add(ball);

      // setup debug raycaster
      doRaycast = () => {
        caster.setFromCamera(this.mousePosition, this.camera);
        hits = caster.intersectObject(planeRaycastObject);
        
        if (hits.length !== 0) {
          if (this.onRayCast) this.onRayCast(hits[0].point);
          ball.position.copy(hits[0].point);
        }
        
      }
      
    } else {
      
      // setup prod raycaster
      doRaycast = () => {
        caster.setFromCamera(this.mousePosition, this.camera);
        hits = caster.intersectObject(planeRaycastObject);
        
        if (hits.length !== 0 && this.onRayCast) {
          this.onRayCast(hits[0].point);
        }

      }
    }

    window.addEventListener('mousemove', doRaycast);
  }

  private createRaycastPlane(): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10, 1, 1),
      new THREE.MeshBasicMaterial({ alphaTest: 0, visible: false })
    );
    mesh.position.y = 0.4;
    mesh.rotation.x = -0.25 * TAU;
    this.scene.add(mesh);

    return mesh;
  }

  private setupLights() {
    const ambient = new THREE.AmbientLight( 0xffffff, 0.5 );
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight( 0xeeeeff, 0.9 );
    directional.position.z -= 3;
    directional.position.y += 2;
    this.scene.add(directional)

    if (this.isDebugMode) {
      const directionalHelper = new THREE.DirectionalLightHelper(directional);
      this.scene.add(directionalHelper)
      let lightHelper = new THREE.AxesHelper(0.5)
      lightHelper.position.add(directional.position)
      this.scene.add(lightHelper);
    }
  }

}

type OptionalCallback<T> = ((hit: T) => void) | null

interface Viewport {
  width: number,
  height: number
};
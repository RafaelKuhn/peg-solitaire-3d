// packages
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';

// three
import Resources from '$lib/three/Resources';
import Ticker from '$lib/three/Ticker';
import LoadingScreen from "$lib/three/LoadingScreen";
import autoResize from "$lib/three/AutoResize";

// game
import BoardLogic from "$lib/game/BoardLogic";
import type Movement from '$lib/game/Movement';

// svelte
import { pageTitle } from "$lib/svelte/Stores";
import { Utils } from '$lib/svelte/Utils';
import type PieceWithMovements from '$lib/game/PieceWithMovements';


const TAU = 6.283185;
const HALF_TAU = TAU * 0.5;
const AN_EIGTH = 0.125;

export default class {

  // threejs logic
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private ticker: Ticker;
  
  // game logic
  private boardLogic: BoardLogic;
  
  // TODO: change these to another place, like 'browserData' to replace "Utils bad class"
  private mousePosition: THREE.Vector2;
  private viewport: Viewport;
  private isDebugMode: Boolean = false;


  // TODO: raycaster wrapper class
  private onMouseHover: OptionalCallback<THREE.Vector3> = null;

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

    this.setupGameLogic();

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
          if (this.onMouseHover) { this.onMouseHover(hits[0].point); }
          ball.position.copy(hits[0].point);
        }
      }
    } else {
      
      // setup prod raycaster
      doRaycast = () => {
        caster.setFromCamera(this.mousePosition, this.camera);
        hits = caster.intersectObject(planeRaycastObject);
        if (hits.length !== 0) {
          if (this.onMouseHover) { this.onMouseHover(hits[0].point); }
        }
      }
    }

    window.addEventListener('mousemove', doRaycast);
  }

  private onPieceClicked: (() => void);

  // TODO: game logic class could have a state, currently movable pieces, extract concerns of 'board logic' and 'game logic'
  private setupGameLogic() {
    
    const gameIteration = () => {
      this.boardLogic.resetPiecesColors();

      let movablePieces = this.boardLogic.getCandidateMovements();
      
      if (this.isDebugMode) console.log(`${movablePieces.length} movable pieces`);
      let pieceToMove: PieceWithMovements|null;
      
      movablePieces.forEach(piece => piece.pieceObject.colorAsMovable());

      const testHoveringPieces = mouseWorldPosition => {
        movablePieces.forEach(piece => piece.pieceObject.colorAsMovable());
        pieceToMove = this.boardLogic.getClosestPiece(mouseWorldPosition, movablePieces);

        // test if mouse is hovering a piece which has movements
        if (pieceToMove) {
          
          pieceToMove.pieceObject.colorAsHovered();
          this.changeCursorToPointer();

          if (pieceToMove.movements.length === 1) { // check type if doing thingy

            this.onPieceClicked = clickPieceWithOneMovement;
            window.addEventListener("click", this.onPieceClicked);
          } else {

            this.onPieceClicked =  clickPieceWithMultipleMovements;
            window.addEventListener("click", this.onPieceClicked);
          }
        } else {
          this.resetCursor();

          window.removeEventListener("click", this.onPieceClicked);
        }
      }

      const clickPieceWithOneMovement = () => {
        if (this.isDebugMode) { console.log(`clicked piece `); console.log(pieceToMove?.pieceCoords); }
        window.removeEventListener("click", this.onPieceClicked);
        this.resetCursor();
        this.boardLogic.executeMovement(pieceToMove!, pieceToMove!.movements[0]);
        gameIteration();
      }

      const clickPieceWithMultipleMovements = () => {
        if (this.isDebugMode) { console.log(`clicked piece with +1 movements`); console.log(pieceToMove?.pieceCoords); }
        window.removeEventListener("click", this.onPieceClicked);
        this.resetCursor();
        this.boardLogic.executeMovement(pieceToMove!, pieceToMove!.movements[0]);
        gameIteration();
      }
      
      if (movablePieces.length === 0) {
        this.winOrLoseGame();
      } else {
        this.onMouseHover = testHoveringPieces;
      }
    }

    gameIteration();
  }

  private winOrLoseGame() {
    console.log("you lost or won");
    this.onMouseHover = null;
    window.removeEventListener("click", this.onPieceClicked);
  }
  // end game logic

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

  // TODO: board animations class
  private changeCursorToPointer() {
    document.body.style.cursor = "pointer";
  }

  private resetCursor() {
    document.body.style.cursor = "default";
  }
}

type OptionalCallback<T> = ((hit: T) => void) | null

interface Viewport {
  width: number,
  height: number
};
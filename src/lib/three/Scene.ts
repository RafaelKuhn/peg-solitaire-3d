// packages
import * as THREE from 'three';
// import { gsap } from 'gsap';

// three
import Resources from '$lib/three/Resources';
import Ticker from '$lib/three/Ticker';
import LoadingScreen from "$lib/three/LoadingScreen";
import BrowserData from '$lib/svelte/BrowserData';
import autoResize from "$lib/three/AutoResize";

// game
import BoardLogic from "$lib/game/BoardLogic";
import type PieceWithMovements from '$lib/game/PieceWithMovements';

// svelte
import gameStatus from '$lib/svelte/GameStatus';

// misc
import UniqueDomEvent from '$lib/misc/UniqueDomEvent';
import EventDispatcher from '$lib/misc/EventDispatcher';

const TAU = 6.283185;


export default class {

  // threejs logic
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private ticker: Ticker;
  private onBoardHover: EventDispatcher<THREE.Vector3>;
  
  // game logic
  private boardLogic: BoardLogic;
  
  private mousePosition: THREE.Vector2;
  private viewport: Viewport;

  constructor() {
    this.scene = new THREE.Scene();
    this.viewport = { width: window.innerWidth, height: window.innerHeight }
    this.camera = new THREE.PerspectiveCamera(45, this.viewport.width / this.viewport.height, 0.1, 2000);

    this.mousePosition = new THREE.Vector2(2000, 2000);

    this.ticker = new Ticker();
    this.onBoardHover = new EventDispatcher<THREE.Vector3>();
  } 

  public async setupScene(canvas: HTMLCanvasElement) {

    this.setupLights();

    // Data
    window.addEventListener("mousemove", (evt) => {
      // cursor will go from 0 to 1.0 screen space
      this.mousePosition.x = evt.clientX/this.viewport.width * 2 - 1;
      this.mousePosition.y = (1 - evt.clientY/this.viewport.height) * 2 - 1;
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

    this.scene.background = resources.items["skybox"];
    this.camera.position.set(10.571, 8.536, 4.785); // camera position to look at the board in an angle
  
    const sceneFocus = new THREE.Vector3(0, -2, 0);
    this.camera.lookAt(sceneFocus);

    const rootBoard = resources.items["board"].scene;
    const rootPiece = resources.items["piece"].scene;
    
    this.boardLogic = new BoardLogic(this.scene, rootPiece, rootBoard);
    this.boardLogic.setupPieces();

    this.setupRaycaster();

    this.setupGameLogic();

    // Debug
    if (BrowserData.IsDebugMode) {
      const helper = new THREE.AxesHelper(100);
      this.scene.add(helper);
    }
  }

  public restartGame() {
    this.boardLogic.deleteBlobs();
    this.boardLogic.reorderPieces();

    this.setupGameLogic();
  }

  private setupRaycaster() {
    const caster = new THREE.Raycaster();
    const planeRaycastObject = this.createRaycastPlane();

    const onMouseMove = new UniqueDomEvent("mousemove");

    let hits: THREE.Intersection<THREE.Object3D<THREE.Event>>[];
    let doRaycast: () => void;

    // setup prod raycaster
    doRaycast = () => {
      caster.setFromCamera(this.mousePosition, this.camera);
      hits = caster.intersectObject(planeRaycastObject);
      if (hits.length !== 0) {
        this.onBoardHover.dispatch(hits[0].point);
      }
    }

    // setup debug raycaster
    if (BrowserData.IsDebugMode) {
      const ball = new THREE.Mesh(new THREE.SphereBufferGeometry(0.1, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      this.scene.add(ball);

      doRaycast = () => {
        caster.setFromCamera(this.mousePosition, this.camera);
        hits = caster.intersectObject(planeRaycastObject);

        if (hits.length !== 0) {
          this.onBoardHover.dispatch(hits[0].point);
          ball.position.copy(hits[0].point);
        }
      }
    }

    onMouseMove.setEvent(doRaycast);
  }


  // TODO: game logic class to separate concerns of 'board logic' and 'game logic'
  private setupGameLogic() {

    const onClick = new UniqueDomEvent("click");

    const resetClickAndHoverEvents = () => {
      onClick.unsetEvent();
      this.onBoardHover.unsetEvent();
    }
    
    const gameIteration = () => {
      this.boardLogic.resetPiecesColors();
      resetClickAndHoverEvents();

      let movablePieces = this.boardLogic.getCandidateMovements();
      if (movablePieces.length === 0) {
        this.changeCursorToDefault();
        this.endGame();

        return;
      }

      if (BrowserData.IsDebugMode) { console.log(`${movablePieces.length} movable pieces`); }

      movablePieces.forEach(piece => piece.pieceObject.colorAsMovable());
      let pieceBeingHovered: PieceWithMovements|null;

      const testHoveringPieces = mouseWorldPosition => {
        movablePieces.forEach(piece => piece.pieceObject.colorAsMovable());
        pieceBeingHovered = this.boardLogic.getClosestPiece(mouseWorldPosition, movablePieces);

        // mouse is hovering a piece which has movements
        if (pieceBeingHovered) {
          pieceBeingHovered.pieceObject.colorAsHovered();
          this.changeCursorToPointer();
          
          if (pieceBeingHovered.movements.length === 1) { // check type if doing memory thingy
            onClick.setEvent(() => clickPieceWithOneMovement(pieceBeingHovered!));
          } else {
            onClick.setEvent(() => clickPieceWithMultipleMovements(pieceBeingHovered!));
          }

        } else {
          this.changeCursorToDefault();

          onClick.unsetEvent();
        }
      }

      this.onBoardHover.setEvent(testHoveringPieces);

      const clickPieceWithOneMovement = (piece: PieceWithMovements) => {
        
        if (BrowserData.IsDebugMode) { console.log(`clicked piece ${piece.pieceCoords.x},${piece.pieceCoords.y}, only 1 possible movement`); }
        
        this.changeCursorToDefault();

        this.boardLogic.executeMovement(piece, piece.movements[0]);
        gameIteration();
      }

      const clickPieceWithMultipleMovements = (piece: PieceWithMovements) => {
        
        resetClickAndHoverEvents();

        if (BrowserData.IsDebugMode) { console.log(`clicked piece ${piece.pieceCoords.x},${piece.pieceCoords.y} with ${piece.movements.length} possible movements`); }
        
        this.changeCursorToDefault();
        this.boardLogic.resetPiecesColors();
        piece.pieceObject.colorAsMovable();

        for (const movement of piece.movements!) {
          this.boardLogic.spawnBlob(movement);
        }

        const selectBlob = mouseWorldPosition => {
          this.boardLogic.colorBlobsAsDefault();
          const closestBlob = this.boardLogic.getClosestBlob(mouseWorldPosition);
          
          if (closestBlob) {
            this.changeCursorToPointer();
            this.boardLogic.colorBlobAsSelected(closestBlob);

            const executeMovementAtBlob = () => {
              this.boardLogic.executeMovement(piece, closestBlob.movement);
              this.boardLogic.deleteBlobs();
              gameIteration();
            }
            
            onClick.setEvent(executeMovementAtBlob)
          } else {
            this.changeCursorToDefault();

            onClick.unsetEvent();
          }
        }

        this.onBoardHover.setEvent(selectBlob);
      }
      
    }

    gameIteration();
  }

  private endGame() {
    const remainingPiecesCount = this.boardLogic.countRemaningPieces();

    if (BrowserData.IsDebugMode) console.log(`game ended with ${remainingPiecesCount} pieces`);
    
    if (remainingPiecesCount === 1) {
      gameStatus.set("hasWon")
    } else {
      gameStatus.set("hasLost")
    }
  }
  // end game logic

  private createRaycastPlane(): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10, 1, 1)
    );
    mesh.position.y = 0.4;
    mesh.rotation.x = -0.25 * TAU;
    this.scene.add(mesh);

    if (BrowserData.IsDebugMode) {
      mesh.material = new THREE.MeshNormalMaterial({ normalMapType: THREE.TangentSpaceNormalMap, wireframe: true });
    } else {
      mesh.visible = false;
    }

    return mesh;
  }

  private setupLights() {
    const ambient = new THREE.AmbientLight( 0xffffff, 0.5 );
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight( 0xeeeeff, 0.9 );
    directional.position.z -= 3;
    directional.position.y += 2;
    this.scene.add(directional)

    if (BrowserData.IsDebugMode) {
      const directionalHelper = new THREE.DirectionalLightHelper(directional);
      this.scene.add(directionalHelper)
      let lightHelper = new THREE.AxesHelper(0.5)
      lightHelper.position.add(directional.position)
      this.scene.add(lightHelper);
    }
  }

  private changeCursorToPointer() {
    document.body.style.cursor = "pointer";
  }

  private changeCursorToDefault() {
    document.body.style.cursor = "default";
  }
}

interface Viewport {
  width: number,
  height: number
};
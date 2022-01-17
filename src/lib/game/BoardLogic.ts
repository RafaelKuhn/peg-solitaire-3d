import * as THREE from 'three';

import Piece from '$lib/game/Piece';
import Movement from '$lib/game/Movement';
import PieceWithMovements from '$lib/game/PieceWithMovements';

import { Blob, BlobFactory } from '$lib/game/Blob';

export default class BoardLogic {

  private pieces: PieceMatrix;
  private piecesTrashStack: PieceStack;
  private blobFactory: BlobFactory;
  private blobs: Array<Blob>;

  // TODO: use piecesFactory instead of this
  private rootPiece: THREE.Group;
  private piecesParent: THREE.Group;
  

  private boardTemplate: Array<Array<number>>;

  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, rootPiece: THREE.Group, rootBoard: THREE.Group) {

    this.boardTemplate = [
      [2, 2, 1, 1, 1, 2, 2],
      [2, 2, 1, 1, 1, 2, 2],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [2, 2, 1, 1, 1, 2, 2],
      [2, 2, 1, 1, 1, 2, 2],
    ];

    // blobs debug
    // this.boardTemplate = [ [2, 2, 0, 0, 0, 2, 2], [2, 2, 1, 0, 0, 2, 2], [0, 1, 1, 0, 1, 0, 0], [0, 1, 1, 0, 1, 1, 0], [0, 0, 0, 0, 1, 0, 0], [2, 2, 0, 0, 0, 2, 2], [2, 2, 0, 0, 0, 2, 2], ];
    
    // win panel debug
    this.boardTemplate = [ [2, 2, 0, 0, 0, 2, 2], [2, 2, 0, 1, 0, 2, 2], [0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [2, 2, 0, 0, 0, 2, 2], [2, 2, 0, 0, 0, 2, 2], ];

    this.scene = scene;
    this.rootPiece = rootPiece;
    this.piecesParent = new THREE.Group();

    this.blobFactory = new BlobFactory(rootPiece)
    
    this.piecesTrashStack = [];
    this.blobs = [];
    
    this.scene.add(rootBoard);
    this.scene.add(this.piecesParent);
  }

  public setupPieces(): void {
    this.pieces = [
      [], [], [], [], [], [], []
    ]
    
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {

        if (this.boardTemplate[y][x] !== 1) {
          this.pieces[y][x] = null;
          continue;
        }
        
        const pieceModelClone = this.rootPiece.clone();
        const piecePosition = this.index2DToWorldPosition(x, y);
        pieceModelClone.position.copy(piecePosition);
        
        this.piecesParent.add(pieceModelClone);
        
        this.pieces[y][x] = new Piece(pieceModelClone);
      }
    }

    if (window.location.hash === "#debug") { console.log("starting board:"); this.printBoard(); }
  }

  public countRemaningPieces(): number {
    let count = 0;

    this.pieces.forEach(row => {
      row.forEach(piece => {
        if (piece) {
          count++
        }
      })
    });

    return count; 
  }

  public reorderPieces(): void {
    const remainingPieces = this.getRemainingPieces();
    const trashPieces = this.getPiecesFromTrash()

    const piecesToReorder = remainingPieces.concat(trashPieces);
    
    this.reorderPiecesInBoard(piecesToReorder);
    
    // TODO: remove this, create global way of checking debug mode 'browserData'
    if (window.location.hash === "#debug") { console.log(`pieces reordered: ${remainingPieces.length} from board, ${trashPieces.length} from trash`); this.printBoard(); }
  }

  // TODO: game manager class maybe
  public getCandidateMovements(): Array<PieceWithMovements> {
    const piecesToMove = new Array<PieceWithMovements>();
    
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        // if isOutOfBoard, it has no piece there
        if (this.isOutOfBoard(x, y)) continue;

        // if piece is null, it has a hole there
        const currentPiece = this.pieces[y][x];
        if (!currentPiece) { continue; }

        const movements = new Array<Movement>();
        const currentPieceCoords = { x, y };

        // can be moved right ?
        if (this.isNotOutOfBoard(x+2, y) && this.pieces[y][x+1] !== null && this.pieces[y][x+2] === null) {
          movements.push(new Movement( { x: x+2, y }, { x: x+1, y }))
        }

        // can be moved left ?
        if (this.isNotOutOfBoard(x-2, y) && this.pieces[y][x-1] !== null && this.pieces[y][x-2] === null) {
          movements.push(new Movement( { x: x-2, y }, { x: x-1, y }))
        }

        // can be moved up ? (yes, -y is up, see this.pieces declaration)
        if (this.isNotOutOfBoard(x, y-2) && this.pieces[y-1][x] !== null && this.pieces[y-2][x] === null) {
          movements.push(new Movement( { x, y: y-2 }, { x, y: y-1 }))
        }

        // can be moved down ?
        if (this.isNotOutOfBoard(x, y+2) && this.pieces[y+1][x] !== null && this.pieces[y+2][x] === null) {
          movements.push(new Movement( { x, y: y+2 }, { x, y: y+1 }))
        }

        if (movements.length > 0) {
          piecesToMove.push(new PieceWithMovements(currentPiece, currentPieceCoords, movements));
        } 
      }
    }

    return piecesToMove;
  }

  public getClosestPiece(worldPosition: THREE.Vector3, candidates: Array<PieceWithMovements>): PieceWithMovements|null {
    let closestMovement = candidates[0];
    let closestDistance = worldPosition.distanceTo(candidates[0].pieceObject.position);

    for (let i = 1; i < candidates.length; i++) {
      const currentMovement = candidates[i];
      const currentMovementDist = worldPosition.distanceTo(currentMovement.pieceObject.position);
      if (currentMovementDist < closestDistance) {
        closestDistance = currentMovementDist;
        closestMovement = currentMovement;
      }
    }
    
    if (closestDistance < 1) {
      return closestMovement;
    } else {
      return null;
    }
  }

  public executeMovement(pieceToMove: PieceWithMovements, movement: Movement): void {
    this.movePiece(pieceToMove.pieceObject, pieceToMove.pieceCoords, movement.destination);
    this.putPieceInTrash(movement.eatenPieceCoords)

    if (window.location.hash === "#debug") { console.log(`moving piece ${pieceToMove.pieceCoords.x},${pieceToMove.pieceCoords.y} to ${movement.destination.x},${movement.destination.y} `); console.log("board:"); this.printBoard(); }
  }

  private reorderPiecesInBoard(piecesToReorder: Array<Piece>) {
    this.pieces = [
      [], [], [], [], [], [], []
    ]

    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (this.boardTemplate[y][x] !== 1) {
          this.pieces[y][x] = null;
          continue;
        }

        const piecePopped = piecesToReorder.pop()!;
        const newPiecePosition = this.index2DToWorldPosition(x, y);
        piecePopped.position.copy(newPiecePosition);

        this.pieces[y][x] = piecePopped;
      }
    }
  }

  private getRemainingPieces(): Array<Piece> {
    const pieces: Array<Piece> = [];

    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const piece = this.pieces[y][x];
        if (piece) {
          pieces.push(piece);
        }
      }
    }

    return pieces;
  }

  private getPiecesFromTrash(): Array<Piece> {
    const pieces: Array<Piece> = [];

    let current = this.recoverPieceFromTrash();
    while (current !== null) {
      pieces.push(current);
      current = this.recoverPieceFromTrash();
    }
    
    return pieces;
  }

  private movePiece(piece: Piece, pieceCoords: { x: number, y: number }, destination: { x: number, y: number }): void {
    const pieceToMove = piece;
    const newPiecePos = this.index2DToWorldPosition(destination.x, destination.y);
    
    // TODO: create animation here instead of just copying position
    pieceToMove.position.copy(newPiecePos);

    this.pieces[destination.y][destination.x] = pieceToMove;
    this.pieces[pieceCoords.y][pieceCoords.x] = null;
  }

  // TODO: implement better trash logic
  private putPieceInTrash(coords: { x: number, y: number }): void {
    const pieceToRemove = this.pieces[coords.y][coords.x];
    pieceToRemove?.colorAsDefault();

    this.pieces[coords.y][coords.x] = null;
    this.piecesTrashStack.push(pieceToRemove!);

    pieceToRemove!.position.set(0, 1, -4);
  }

  private recoverPieceFromTrash(): Piece|null {
    const pieceBack = this.piecesTrashStack.pop();
    return pieceBack ?? null;
  }

  // TODO: get these blobs out of here for gods sake
  public spawnBlob(movement: Movement): void {
    const blob = this.blobFactory.createBlob(movement)

    const location = this.index2DToWorldPosition(blob.movement.destination.x, blob.movement.destination.y);
    blob.position.copy(location);
    blob.addToScene(this.scene);
    
    this.blobs.push(blob);
  }
  
  public getClosestBlob(mouseWorldPosition: THREE.Vector3): Blob|null {
    let closestBlob = this.blobs[0];
    let closestBlobDist = mouseWorldPosition.distanceTo(closestBlob.position);

    for (let i = 1; i < this.blobs.length; i++) {
      let currentBlob = this.blobs[i];
      let currentBlobDist = mouseWorldPosition.distanceTo(currentBlob.position);
      
      if (currentBlobDist < closestBlobDist) {
        closestBlobDist = currentBlobDist;
        closestBlob = currentBlob;
      }
    }

    if (closestBlobDist < 1) {
      return closestBlob;
    } else {
      return null;
    }
  }
  // end blobs

  public resetPiecesColors(): void {
    this.pieces.forEach(row => row.forEach(piece => piece?.colorAsDefault()));
  }

  public colorBlobsAsDefault(): void {
    this.blobs.forEach(blob => this.blobFactory.colorBlobAsDefault(blob));
  }

  public colorBlobAsSelected(selectedBlob: Blob) {
    this.blobFactory.colorBlobAsSelected(selectedBlob);
  }

  public deleteBlobs(): void {
    this.blobs.forEach(blob => blob.removeFromScene(this.scene));
    this.blobs = new Array<Blob>();
  }

  private isNotOutOfBoard(x: number, y: number): boolean {
    return (!this.isOutOfBoard(x, y));
  }
  
  private isOutOfBoard(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x > 6 || y > 6) { return true; }

    const possibleXCorner = (x <= 1 || x >= 5);
    const possibleYCorner = (y <= 1 || y >= 5);
    
    return (possibleXCorner && possibleYCorner);
  }

  private index2DToWorldPosition(x: number, y: number): THREE.Vector3 {
    return new THREE.Vector3(y-3, 0, 3-x);
  }

  private printBoard() {
    let s = '  0 1 2 3 4 5 6\n';
    for (let y = 0; y < 7; y++) {
      s += `${y} `;
      for (let x = 0; x < 7; x++) {
        const el = this.pieces[y][x];
        if (el == null) {
          s += `  `;
        } else {
          s += `1 `
        }
      }
      s += '\n';
    }
    console.log(s);
  }

}

type PieceMatrix = Array<Array<Piece|null>>;

type PieceStack = Array<Piece>;
import * as THREE from 'three';

import Piece from '$lib/game/Piece';
import Movement from '$lib/game/Movement';

export default class BoardLogic {

  private pieces: PieceMatrix;
  private piecesAsideStack: PieceArray;

  private rootPiece: THREE.Group;
  private piecesParent: THREE.Group;
  
  private boardTemplate: Array<Array<number>>;

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

    this.rootPiece = rootPiece;

    this.piecesParent = new THREE.Group();
    
    this.piecesAsideStack = [];

    scene.add(this.piecesParent, rootBoard);
  }

  public setupPieces() {
    this.pieces = [
      [], [], [], [], [], [], []
    ]
    
    for (let y = 0; y < 7; y++) {
      for (let x = 6; x >= 0; x--) {

        if (this.boardTemplate[y][x] !== 1) {
          this.pieces[y][x] = null;
          continue;
        }
        
        const pieceObjectGroup = this.rootPiece.clone();
        const piecePosition = this.index2DToWorldPosition(x, y);
        pieceObjectGroup.position.copy(piecePosition);
        
        this.piecesParent.add(pieceObjectGroup);
        
        this.pieces[y][x] = new Piece(pieceObjectGroup);
      }
    }
  }

  // TODO: game logic class maybe
  // could run 3x3, 3x7, 3x3 fors instead of 7x7
  // return a instance of type 'movement'
  public getCandidateMovements(): Array<Movement> {
    const movements = new Array<Movement>();
    
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        // if isOutOfBoard, it has no piece or even a hole there
        if (this.isOutOfBoard(x, y)) continue;

        // if piece is null, it has a hole there
        const currentPiece = this.pieces[y][x];
        if (!currentPiece) { continue; }

        // can be moved right ?
        if (this.isNotOutOfBoard(x+2, y) && this.pieces[y][x+1] !== null && this.pieces[y][x+2] === null) {
          movements.push(new Movement(currentPiece, { x, y }, { x: x+2, y }, { x: x+1, y }))
        }

        // can be moved left ?
        if (this.isNotOutOfBoard(x-2, y) && this.pieces[y][x-1] !== null && this.pieces[y][x-2] === null) {
          movements.push(new Movement(currentPiece, { x, y }, { x: x-2, y }, { x: x-1, y }))
        }

        // can be moved up ? (yes, y- is up, see this.pieces declaration)
        if (this.isNotOutOfBoard(x, y-2) && this.pieces[y-1][x] !== null && this.pieces[y-2][x] === null) {
          movements.push(new Movement(currentPiece, { x, y }, { x, y: y-2 }, { x, y: y-1 }))
        }

        // can be moved down ?
        if (this.isNotOutOfBoard(x, y+2) && this.pieces[y+1][x] !== null && this.pieces[y+2][x] === null) {
          movements.push(new Movement(currentPiece, { x, y }, { x, y: y+2 }, { x, y: y+1 }))
        }
      }
    }

    return movements;
  }

  public getClosestMovement(worldPosition: THREE.Vector3, candidates: Array<Movement>): Movement|null {
    let closestMovement = candidates[0];
    let closestDistance = worldPosition.distanceTo(candidates[0].pieceToMove.position);

    for (let i = 1; i < candidates.length; i++) {
      const currentMovement = candidates[i];
      const currentMovementDist = worldPosition.distanceTo(currentMovement.pieceToMove.position);
      if (currentMovementDist < closestDistance) {
        closestDistance = currentMovementDist;
        closestMovement = currentMovement;
      }
    }
    
    if (closestDistance > 1) {
      return null;
    } else {
      return closestMovement;
    }
  }

  public executeMovement(movement: Movement) {
    
    this.movePiece(movement.pieceToMove, movement.pieceToMoveCoord, movement.pieceDestinationCoords);
    this.putPieceInThrash(movement.eatenPieceCoords)

    // TODO: remove this, create global way of checking debug mode 'browserData'
    if (window.location.hash === "#debug") { console.log("new board:"); this.printBoard(); }
  }

  private movePiece(piece: Piece, pieceCoords: { x: number, y: number }, destination: { x: number, y: number } ) {
    const pieceToMove = piece;
    const newPiecePos = this.index2DToWorldPosition(destination.x, destination.y);
    
    // TODO: create animation here instead of just copying position
    pieceToMove.position.copy(newPiecePos);

    this.pieces[destination.y][destination.y] = pieceToMove;
    this.pieces[pieceCoords.y][pieceCoords.x] = null;
  }

  // TODO: implement better thrash logic
  private putPieceInThrash(coords: { x: number, y: number }) {
    const pieceToRemove = this.pieces[coords.y][coords.x];

    this.piecesAsideStack.push(pieceToRemove);
    pieceToRemove!.position.set(0, 1, -4);
  }

  private recoverPieceFromThrash(coords: { x: number, y: number }) {
    const pieceBack = this.piecesAsideStack.pop();
    if (!pieceBack) throw `error: pieceback should not be null ${pieceBack}`;
    
    this.pieces[coords.y][coords.x] = pieceBack;
    pieceBack.position.copy(this.index2DToWorldPosition(coords.x, coords.y));
  }



  private isOutOfBoard(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x > 6 || y > 6) { return true; }

    const possibleXCorner = (x <= 1 || x >= 5);
    const possibleYCorner = (y <= 1 || y >= 5);
    
    return (possibleXCorner && possibleYCorner);
  }

  private isNotOutOfBoard(x: number, y: number): boolean {
    return (!this.isOutOfBoard(x, y));
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
        } else if (typeof el === 'object') {
          s += `1 `
        }
      }
      s += '\n';
    }
    console.log(s);
  }

}

type PieceMatrix = Array<Array<Piece|null>>;
type PieceArray = Array<Piece|null>;
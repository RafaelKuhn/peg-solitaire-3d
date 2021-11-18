import * as THREE from 'three';

export default class Board {
  
  constructor(scene, rootPiece, rootBoard) {

    /** @type {THREE.Group} */
    this.rootPiece = rootPiece;

    /** @type {THREE.Group} */
    this.boardObj = rootBoard;

    scene.add(rootBoard);

    this.piecesObj = new THREE.Group();
    this.piecesObj.scale.z = -1;
    scene.add(this.piecesObj);
  }

  setupPieces(templateBoard) {
    this.pieces = this.#duplicateMatrix(templateBoard);

    for (let y = 0; y<7; y++) {
      for (let x = 0; x<7; x++) {
        if (templateBoard[y][x] === 1) {
          const xWorldPos = y-3;
          const zWorldPos = x-3;

          const piece = this.rootPiece.clone();
          piece.position.set(xWorldPos, 0, zWorldPos);
          
          this.piecesObj.add(piece);
          
          this.pieces[y][x] = piece;
        }
      }
    }
  }

  movePiece(pieceX, pieceY, newPieceX, newPieceY) {

    /** @type {THREE.Mesh} */
    const piece = this.pieces[pieceY][pieceX];

    const medianX = (newPieceX+pieceX)/2;
    const medianY = (newPieceY+pieceY)/2;

    /** @type {THREE.Mesh} */
    const pieceToRemove = this.pieces[medianY][medianX];
    
    const newPiecePos = this.#index2DToWorldPosition(newPieceX, newPieceY);
    piece.position.copy(newPiecePos);
    
    pieceToRemove.position.set(-5, 0, -7);
    this.#putAside(pieceToRemove);
    
    // update pieces array
    this.pieces[newPieceY][newPieceX] = piece;
    this.pieces[pieceY][pieceX] = 0;
    this.pieces[medianY][medianX] = 0;
  }

  /** @returns {THREE.Vector3} */
  #index2DToWorldPosition(x, y) {
    return new THREE.Vector3(y-3, 0, x-3);
  }

  #duplicateMatrix(rootMatrix) {
    return rootMatrix.map(el => el.slice());
  }

  #deletedXPos = -4;
  #putAside(obj) {
    obj.position.set(this.#deletedXPos, 0, 4.25);
    this.#deletedXPos += 0.5;
  }

  #printBoard(board) {
    let s = '  0 1 2 3 4 5 6\n';
    for (let y = 0; y < 7; y++) {
      s += `${y} `;
      for (let x = 0; x < 7; x++) {
        const el = board[y][x];
        if (el == 2) {
          s += '  ';
        } else if (typeof el === 'object') {
          s += `1 `
        } else {
          s += `${el} `
        }
      }
      s += '\n';
    }
    console.log(s);
  }

}
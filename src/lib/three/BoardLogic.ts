import * as THREE from 'three';

export default class BoardLogic {

  private pieces: Board;
  private piecesAsideStack: Array<THREE.Group>;

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

    scene.add(rootBoard);

    this.piecesParent = new THREE.Group();
    this.piecesParent.scale.z = -1;
    scene.add(this.piecesParent);
    
    this.piecesAsideStack = [];
  }

  public setupPieces() {
    // create pieces 3d objects in scene from boardTemplate
    this.pieces = [
      [], [], [], [], [], [], []
    ]
    
    for (let y = 0; y<7; y++) {
      for (let x = 0; x<7; x++) {

        if (this.boardTemplate[y][x] !== 1) continue;
        
        const piece = this.rootPiece.clone();
        const piecePosition = this.index2DToWorldPosition(x, y);
        piece.position.copy(piecePosition);
        
        this.piecesParent.add(piece);
        
        this.pieces[y][x] = piece;
      }
    }
  }

  movePiece(pieceX, pieceY, newPieceX, newPieceY) {

    if (window.location.hash === "#debug")
      this.printBoard(this.pieces);

    const piece = this.pieces[pieceY][pieceX];
    
    const newPiecePos = this.index2DToWorldPosition(newPieceX, newPieceY);
    piece.position.copy(newPiecePos);
        
    // update pieces array
    this.pieces[newPieceY][newPieceX] = piece;
    this.pieces[pieceY][pieceX] = null;
  }

  public putPieceAside(pieceX, pieceY) {
    const pieceToRemove = this.pieces[pieceY][pieceX];
    this.piecesAsideStack.push(pieceToRemove);
    pieceToRemove.position.set(0, 3, 0);

    this.pieces[pieceY][pieceX] = null;
  }

  public putPieceBack(pieceX, pieceY) {
    const pieceBack = this.piecesAsideStack.pop();
    this.pieces[pieceY][pieceX] = pieceBack;

    pieceBack.position.copy(this.index2DToWorldPosition(pieceX, pieceY));
  }


  private index2DToWorldPosition(x, y): THREE.Vector3 {
    return new THREE.Vector3(y-3, 0, x-3);
  }

  private printBoard(board) {
    let s = '  0 1 2 3 4 5 6\n';
    for (let y = 0; y < 7; y++) {
      s += `${y} `;
      for (let x = 0; x < 7; x++) {
        const el = board[y][x];
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

type Board = Array<Array<THREE.Group>>;
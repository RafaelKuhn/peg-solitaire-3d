import * as THREE from 'three';

export default class BoardLogic {

  private pieces: GroupMatrix;
  private piecesAsideStack: GroupArray;

  private rootPiece: THREE.Group;
  private piecesParent: THREE.Group;
  
  private boardTemplate: Array<Array<number>>;


  // TODO: board animations class
  private movableMaterial: THREE.MeshStandardMaterial;
  private hoveredMaterial: THREE.MeshStandardMaterial;

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

    this.movableMaterial = new THREE.MeshStandardMaterial({ color: 0x4f86c5 })
    this.hoveredMaterial = new THREE.MeshStandardMaterial({ color: "green" })

    scene.add(this.piecesParent, rootBoard);
  }

  // create pieces 3d objects in scene from boardTemplate
  public setupPieces() {
    this.pieces = [
      [], [], [], [], [], [], []
    ]
    
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {

        if (this.boardTemplate[y][x] !== 1) {
          this.pieces[y][x] = null;
          continue;
        }
        
        const piece = this.rootPiece.clone();
        const piecePosition = this.index2DToWorldPosition(x, y);
        piece.position.copy(piecePosition);
        
        this.piecesParent.add(piece);
        
        this.pieces[y][x] = piece;
      }
    }
  }

  // TODO: game logic class maybe
  // could run 3x3, 3x7, 3x3 fors instead of 7x7
  // return a instance of type 'movement'
  public getMovablePieces(): Array<THREE.Group> {
    const movements = new Array<THREE.Group>();
    
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        // if isOutOfBoard, it has no piece or even a hole there
        if (this.isOutOfBoard(x, y)) continue;

        // if piece is null, it has a hole there
        const currentPiece = this.pieces[y][x];
        if (!currentPiece) { continue; }

        // can be moved right ?
        if (this.isNotOutOfBoard(x+2, y) && this.pieces[y][x+1] !== null && this.pieces[y][x+2] === null) {
          movements.push(currentPiece)
        }

        // can be moved left ?
        if (this.isNotOutOfBoard(x-2, y) && this.pieces[y][x-1] !== null && this.pieces[y][x-2] === null) {
          movements.push(currentPiece)
        }

        // can be moved up ? (y- is up, see this.pieces declaration)
        if (this.isNotOutOfBoard(x, y-2) && this.pieces[y-1][x] !== null && this.pieces[y-2][x] === null) {
          movements.push(currentPiece)
        }

        // can be moved down ?
        if (this.isNotOutOfBoard(x, y+2) && this.pieces[y+1][x] !== null && this.pieces[y+2][x] === null) {
          movements.push(currentPiece)
        }
      }
    }

    return movements;
  }

  // TODO: change to array of 'movement'
  public getClosestPiece(hitPos: THREE.Vector3, pieces: Array<THREE.Group>): THREE.Group|null {
    let closest = pieces[0];
    let closestDist: number = hitPos.distanceTo(closest.position);

    for (let i = 1; i < pieces.length; i++) {
      const piece = pieces[i];
      const pieceDist = hitPos.distanceTo(piece.position);
      if (pieceDist < closestDist) {
        closestDist = pieceDist;
        closest = piece;
      }
    }

    return closestDist < 1.5 ? closest : null;
  }


  // TODO: board visuals class
  public colorPiecesAsMovable(pieces: THREE.Group[]): void {
    pieces.forEach(piece => this.colorPieceAsMovable(piece));
  }

  public colorPieceAsMovable(piece: THREE.Group): void {
    const pieceMesh = piece.children[0] as THREE.Mesh;
    pieceMesh.material = this.movableMaterial;
  }

  public colorPieceAsHovered(piece: THREE.Group): void {
    const pieceMesh = piece.children[0] as THREE.Mesh;
    pieceMesh.material = this.hoveredMaterial;
  }
  


  public movePiece(pieceX, pieceY, newPieceX, newPieceY) {

    if (window.location.hash === "#debug")
      this.printBoard(this.pieces);

    const piece = this.pieces[pieceY][pieceX];
    
    const newPiecePos = this.index2DToWorldPosition(newPieceX, newPieceY);
    
    if (!piece) { throw "error: piece can't be null"; }
    piece.position.copy(newPiecePos);
        
    // update pieces array
    this.pieces[newPieceY][newPieceX] = piece;
    this.pieces[pieceY][pieceX] = null;
  }

  public putPieceAside(pieceX, pieceY) {
    const pieceToRemove = this.pieces[pieceY][pieceX];
    if (!pieceToRemove) { throw "error: piece can't be null"; }

    this.piecesAsideStack.push(pieceToRemove);
    pieceToRemove.position.set(0, 3, 0);

    this.pieces[pieceY][pieceX] = null;
  }

  public putPieceBack(pieceX, pieceY) {
    const pieceBack = this.piecesAsideStack.pop();
    if (!pieceBack) throw `error: pieceback should not be null ${pieceBack}`;
    
    this.pieces[pieceY][pieceX] = pieceBack;
    pieceBack.position.copy(this.index2DToWorldPosition(pieceX, pieceY));
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

  private index2DToWorldPosition(x, y): THREE.Vector3 {
    return new THREE.Vector3(y-3, 0, x-3);
  }

  private isNotNull(x): boolean {
    return (x !== null) ? true : false;
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

type GroupMatrix = Array<Array<THREE.Group|null>>;
type GroupArray = Array<THREE.Group|null>;

class Movement {
  public piece: THREE.Group;
  public pieceCoordinate: { x: number, y: number};
  public eatenCoordinate: { x: number, y: number};
  public jumpToCoordinate: { x: number, y: number};
}
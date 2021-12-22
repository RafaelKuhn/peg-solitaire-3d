import type Movement from '$lib/game/Movement';
import type Piece from '$lib/game/Piece';

export default class PieceWithMovements {
  public readonly pieceObject: Piece;
  public readonly pieceCoords: { x: number, y: number };
  public readonly movements: Array<Movement>;

  constructor (piece: Piece, pieceCoords: { x: number, y: number }, movements: Array<Movement>) {
    this.pieceObject = piece;
    this.pieceCoords = pieceCoords;
    this.movements = movements;
  }

  // TODO: call this and get materials from singleton
  public colorAsMovable() {
    console.log(`coloring piece ${this.pieceCoords.x},${this.pieceCoords.y} with ${this.movements.length} movements`);
  }
}
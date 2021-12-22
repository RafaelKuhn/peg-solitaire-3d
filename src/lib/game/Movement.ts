import type Piece from '$lib/game/Piece';

export default class Movement {
  
  constructor (
    public pieceToMove: Piece,
    public pieceToMoveCoord: { x: number, y: number },
    public pieceDestinationCoords: { x: number, y: number },
    public eatenPieceCoords: { x: number, y: number },
  ) { }
}
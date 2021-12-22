export default class Movement {
  constructor (
    public readonly destination: { x: number, y: number },
    public readonly eatenPieceCoords: { x: number, y: number },
  ) { }
}
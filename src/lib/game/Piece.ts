import * as THREE from 'three';

export default class Piece {
  private mesh: THREE.Mesh;
  private modelGroup: THREE.Group;
  
  // TODO: find less hacky way to do this
  private static isMemoryLoaded: boolean = false;

  private static defaultMaterial: THREE.MeshStandardMaterial;
  private static movableMaterial: THREE.MeshStandardMaterial;
  private static hoveredMaterial: THREE.MeshStandardMaterial;

  constructor (modelGroup: THREE.Group) {
    this.modelGroup = modelGroup;
    this.mesh = this.modelGroup.children[0] as THREE.Mesh;

    if (!Piece.isMemoryLoaded) {
      Piece.defaultMaterial = this.mesh.material as THREE.MeshStandardMaterial;
      Piece.movableMaterial = new THREE.MeshStandardMaterial({ color: 0x4f86c5 });
      Piece.hoveredMaterial = new THREE.MeshStandardMaterial({ color: 0x008000 });
    }

    Piece.isMemoryLoaded = true;
  }

  get position(): THREE.Vector3 {
    return this.modelGroup.position;
  }

  public colorAsMovable() {
    this.mesh.material = Piece.movableMaterial;
  }

  public colorAsHovered() {
    this.mesh.material = Piece.hoveredMaterial;
  }
}
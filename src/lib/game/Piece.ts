import * as THREE from 'three';

export default class Piece {
  private mesh: THREE.Mesh;
  private modelGroup: THREE.Group;
  
  // TODO: use typescript 4.4 static block feature (not yet supported)
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
  
      Piece.isMemoryLoaded = true;
    }
  }

  public get position(): THREE.Vector3 {
    return this.modelGroup.position;
  }

  public colorAsDefault() {
    this.mesh.material = Piece.defaultMaterial;
  }

  public colorAsMovable() {
    this.mesh.material = Piece.movableMaterial;
  }

  public colorAsHovered() {
    this.mesh.material = Piece.hoveredMaterial;
  }
  
}
import type Movement from '$lib/game/Movement';

import * as THREE from 'three';


export default class Blob {
  private _mesh: THREE.Mesh;
  private _movement: Movement;
  
  // TODO: use typescript 4.4 static block feature (not yet supported)
  private static isMemoryLoaded: boolean = false;

  private static blobGeometry: THREE.BoxBufferGeometry;
  private static defaultMaterial: THREE.MeshStandardMaterial;
  public static selectedBlobMaterial: THREE.MeshStandardMaterial;

  constructor (movement: Movement) {
    
    if (!Blob.isMemoryLoaded) {
      Blob.defaultMaterial = new THREE.MeshStandardMaterial({ color: 0xff2600, opacity: 0.3 })
      Blob.selectedBlobMaterial = new THREE.MeshStandardMaterial();
    
      Blob.selectedBlobMaterial.copy(Blob.defaultMaterial);
      Blob.defaultMaterial.transparent = true;

      Blob.blobGeometry =  new THREE.BoxBufferGeometry(0.3, 0.6, 0.3, 1, 1, 1),
      
      Blob.isMemoryLoaded = true;
    }

    this._mesh = new THREE.Mesh(Blob.blobGeometry, Blob.defaultMaterial);
    this._movement = movement;
  }

  public get position(): THREE.Vector3 {
    return this._mesh.position;
  }

  public get movement(): Movement {
    return this._movement;
  }
  
  public colorAsDefault() {
    this._mesh.material = Blob.defaultMaterial;
  }

  public colorAsSelected() {
    this._mesh.material = Blob.selectedBlobMaterial;
  }

  public addToScene(scene: THREE.Scene) {
    scene.add(this._mesh);
  }

  public removeFromScene(scene: THREE.Scene) {
    scene.remove(this._mesh);
  }
}


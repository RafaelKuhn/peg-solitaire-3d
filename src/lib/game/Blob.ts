import type Movement from '$lib/game/Movement';

import * as THREE from 'three';


export class BlobFactory {

  private _blobRootModel: THREE.Group;
  private _defaultMaterial: THREE.MeshStandardMaterial;
  private _selectedBlobMaterial: THREE.MeshStandardMaterial;

  constructor(blobModel: THREE.Group) {
    this._blobRootModel = blobModel;

    const blobColor = 0x008000;
    this._defaultMaterial = new THREE.MeshStandardMaterial({ color: blobColor, opacity: 0.3 })
    this._defaultMaterial.transparent = true;
    
    this._selectedBlobMaterial = new THREE.MeshStandardMaterial({ color: blobColor });
  }

  public createBlob(movement: Movement): Blob {
    const blobClone = this._blobRootModel.clone();
    const blob = new Blob(blobClone, movement);
    blob.colorAs(this._defaultMaterial);
    return blob;
  }

  public colorBlobAsDefault(blob: Blob): void {
    blob.colorAs(this._defaultMaterial);
  }

  public colorBlobAsSelected(blob: Blob): void {
    blob.colorAs(this._selectedBlobMaterial);
  }

}

export class Blob {

  private _model: THREE.Group;
  private _mesh: THREE.Mesh;
  private _movement: Movement;
    
  constructor(modelGroup: THREE.Group, movement: Movement) {  
    this._model = modelGroup;
    this._mesh = modelGroup.children[0] as THREE.Mesh;
    this._movement = movement;
  }

  public get position(): THREE.Vector3 {
    return this._mesh.position;
  }

  public get movement(): Movement {
    return this._movement;
  }
  
  public addToScene(scene: THREE.Scene): void {
    scene.add(this._model);
  }

  public removeFromScene(scene: THREE.Scene): void {
    scene.remove(this._model);
  }

  public colorAs(material: THREE.Material): void {
    this._mesh.material = material;
  }
}


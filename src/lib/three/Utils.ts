import type * as THREE from 'three';
import gsap from 'gsap';

export function lerpGroupOpacity(group: THREE.Group, amount) {
  group.traverse(obj => {
    if (obj.type === "Mesh") {
      // obj = obj as THREE.Mesh;
      
      // let mesh = obj as THREE.Mesh;
      // let mat: THREE.Material = mesh.material as THREE.Material;
      gsap.fromTo((obj as THREE.Mesh).material, { duration: 3 }, { duration: 3 })
    }
  })
}

/** @param {THREE.Mesh} mesh */
export function lerpMeshOpacity(mesh) {
  mesh.material.transparent = true;
  mesh.material.opacity = 1;
  console.log(mesh.material);

}
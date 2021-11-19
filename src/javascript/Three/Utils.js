import * as THREE from 'three';
import gsap from 'gsap';

/** @param {THREE.Group} group */
export function lerpGroupOpacity(group, amount) {
  group.traverse(obj => {
    if (obj.type === "Mesh") {
      gsap.to(obj.material, "")
    }
  })
}

/** @param {THREE.Mesh} mesh */
export function lerpMeshOpacity(mesh) {
  mesh.material.transparent = true;
  mesh.material.opacity = 1;
  console.log(mesh.material);

}
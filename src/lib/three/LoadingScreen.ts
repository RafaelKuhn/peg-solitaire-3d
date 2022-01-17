import * as THREE from "three";

export default class LoadingScreen {

  private scene;
  private camera;

  private mesh: THREE.Mesh;

  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
  }

  public show() {
    this.camera.position.set(6, 4, 2); // z 0
    this.camera.lookAt(new THREE.Vector3(0, 2, 0));
  
    this.mesh = new THREE.Mesh(
      new THREE.IcosahedronBufferGeometry(10,2),
      new THREE.MeshBasicMaterial({
        map: this.gradientTexture([[0.75,0.6,0.4,0.25], ['#00111a', '#4b5f7f', '#34726e', '#34726e']]),
        side: THREE.BackSide,
        depthWrite: false,
        fog: false
      })
    );

    this.scene.add(this.mesh);
  }

  public dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.MeshBasicMaterial).dispose();
    this.scene.remove(this.mesh);
  }

  private gradientTexture(colorStopMatrix) {
    var c = document.createElement("canvas");
    var ct = c.getContext("2d")!;
    var size = 1024;
    c.width = 16; c.height = size;
    var gradient = ct.createLinearGradient(0,0,0,size);
    var i = colorStopMatrix[0].length;
    while(i--) { gradient.addColorStop(colorStopMatrix[0][i],colorStopMatrix[1][i]); }
    ct.fillStyle = gradient;
    ct.fillRect(0, 0, 16, size);
    var texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
  }

}


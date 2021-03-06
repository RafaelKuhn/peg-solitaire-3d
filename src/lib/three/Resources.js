import { CubeTextureLoader, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class {

  items = [];

  // TODO: use enums and refactor to typescript
  // could make it take 5 seconds to load to preview changes in loading screen
  #cubemapEndings = [ "xpos", "xneg", "ypos", "yneg", "zpos", "zneg" ]
  #itemsToLoad = [
    { key: "skybox", type: "cubemap", path: "static/skybox/nebula_$.jpg" },
    { key: "skyMatcap", type: "texture", path: "static/matcaps/med1.jpg" },
    { key: "board", type: "glb", path: "static/models/board.glb" },
    { key: "piece", type: "glb", path: "static/models/piece.glb" },
  ]
  
  #amountToLoad = 0;
  #amountLoaded = 0;
  
  #onProgress;
  
  #textureLoader
  #cubeTextureLoader
  #glbLoader

  constructor(onProgress) {

    this.#amountToLoad = 0;
    this.#amountLoaded = 0;

    this.#onProgress = onProgress;

    this.#textureLoader = new TextureLoader();
    this.#cubeTextureLoader = new CubeTextureLoader();
    this.#glbLoader = new GLTFLoader();
  }


  async loadResources() {

    const loadersByType = {
      "texture": this.#loadTexture,
      "cubemap": this.#loadCubemap,
      "glb": this.#loadGLB,
    }

    const promises = [];

    for (const element of this.#itemsToLoad) {
      const loadMethod = loadersByType[element.type];
      if (loadMethod) {
        const loadPromise = loadMethod(element.key, element.path);
        promises.push(loadPromise);
      }
    }

    await Promise.all(promises);
  }

  #makeProgress = () => {
    this.#amountLoaded++;
    
    if (this.#onProgress)
      this.#onProgress(this.#amountLoaded/this.#amountToLoad);
  }


  #loadTexture = (key, path) => {
    this.#amountToLoad++;

    return new Promise(resolve => {
      this.#textureLoader.load(path, texture => {
        this.items[key] = texture;
        this.#makeProgress();
        resolve(null);
      })
    });
  }

  #loadCubemap = (key, path) => {
    this.#amountToLoad++;

    const pathsToLoad = this.#cubemapEndings.map(el => path.replace("$", el));

    return new Promise(resolve => {
      this.#cubeTextureLoader.load(pathsToLoad, cubemap => {
        this.items[key] = cubemap;
        this.#makeProgress();
        resolve(null);
      })
    })
  }

  #loadGLB = (key, path) => {
    this.#amountToLoad++;

    return new Promise(resolve => {
      this.#glbLoader.load(path, glbObject => {
        this.items[key] = glbObject;
        this.#makeProgress();
        resolve(null);
      })
    })
  }

}
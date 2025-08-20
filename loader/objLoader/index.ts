import * as THREE from "three";
import type { Base } from "../../base";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import type { ObjLoaderConfig } from "./types";
import { Mitt } from "../../tools/mitt";

class ObjLoader extends Mitt {
  base: Base;
  private mtlLoader: MTLLoader;
  private objLoader: OBJLoader;
  progress: { title: string; value: string };

  constructor(base: Base) {
    super();
    this.base = base;
    this.mtlLoader = new MTLLoader();
    this.objLoader = new OBJLoader();
    this.progress = { title: "", value: "0%" };
  }

  load(config: ObjLoaderConfig) {
    this.progress = { title: "", value: "0%" };
    const { mtlPath } = config;
    if (mtlPath) {
      return this.mtlLoad(config);
    } else {
      return this.objLoad(config);
    }
  }

  mtlLoad(config: ObjLoaderConfig) {
    return new Promise<THREE.Mesh | THREE.Group>((resolve, reject) => {
      const { mtlPath } = config;
      this.mtlLoader.load(
        mtlPath!,
        (mtlObj: MTLLoader.MaterialCreator) => {
          //加载完成
          this.objLoader.setMaterials(mtlObj);
          this.progress = { title: "材质加载完成", value: "100%" };
          this.emit("progress", this.progress);
          this.objLoad(config).then(resolve).catch(reject);
        },
        (xhr) => {
          //加载进度回调
          this.progress = {
            title: "正在加载材质",
            value: `${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`,
          };
          this.emit("progress", this.progress);
        },
        (err) => {
          console.log("加载材质出错", err);
        }
      );
    });
  }

  objLoad(config: ObjLoaderConfig) {
    return new Promise<THREE.Mesh | THREE.Group>((resolve, reject) => {
      const { objPath, shadow = this.base.autoShadow, name = "" } = config;
      this.objLoader.load(
        objPath,
        (modelObj: THREE.Group) => {
          //加载完成
          let model: THREE.Mesh | THREE.Group;
          model = modelObj;
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = shadow; // 设置投射阴影
              child.receiveShadow = shadow; // 设置接收阴影
            }
          });
          this.base.addToScene(model, name);
          this.progress = {
            title: "模型加载完成",
            value: `100%`,
          };
          this.emit("progress", this.progress);
          resolve(model);
        },
        (xhr) => {
          //加载进度
          this.progress = {
            title: "正在加载模型",
            value: `${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`,
          };
          this.emit("progress", this.progress);
        },
        (err) => {
          //失败
          console.log("加载模型出错", err);
          reject(err);
        }
      );
    });
  }
}

export { ObjLoader };

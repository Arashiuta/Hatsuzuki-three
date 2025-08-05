import * as THREE from "three";
import type { Base } from "../../base";
import type { ObjLoaderConfig } from "./types";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

class ObjLoader {
  base: Base;
  config: ObjLoaderConfig;
  mtlLoader: MTLLoader;
  objLoader: OBJLoader;
  progress: { title: string; value: string };
  model: THREE.Mesh | THREE.Group | null;

  constructor(base: Base, config: ObjLoaderConfig) {
    this.base = base;
    this.config = config;
    this.mtlLoader = new MTLLoader();
    this.objLoader = new OBJLoader();
    this.progress = { title: "", value: "0%" };
    this.model = null;

    this.init();
  }

  async init() {
    const { objPath, mtlPath } = this.config;
    if (mtlPath) {
      await this.mtlLoad(mtlPath, objPath);
    } else {
      await this.objLoad(objPath);
    }
  }

  async mtlLoad(mtlPath: string, objPath: string) {
    this.mtlLoader.load(
      mtlPath,
      (mtlObj: MTLLoader.MaterialCreator) => {
        //加载完成
        this.progress = { title: "材质加载完成", value: "100%" };
        this.objLoader.setMaterials(mtlObj);
        this.objLoad(objPath);
      },
      (xhr) => {
        //加载进度回调
        this.progress = {
          title: "正在加载材质",
          value: `${(xhr.loaded / xhr.total) * 100}%`,
        };
      },
      (err) => {
        console.log("加载材质出错", err);
      }
    );
  }

  async objLoad(objPath: string) {
    this.objLoader.load(
      objPath,
      (modelObj: THREE.Group) => {
        //加载完成
        this.model = modelObj;
        const { autoShadow = false, name = "" } = this.config;
        this.model.name = name;
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = autoShadow; // 设置投射阴影
            child.receiveShadow = autoShadow; // 设置接收阴影
          }
        });
        this.base.scene.add(this.model);
      },
      (xhr) => {
        //加载进度
        this.progress = {
          title: "正在加载模型",
          value: `${(xhr.loaded / xhr.total) * 100}%`,
        };
      },
      (err) => {
        //失败
        console.log("加载模型出错", err);
      }
    );
  }

  getModel() {
    return this.model;
  }
}

export { ObjLoader };

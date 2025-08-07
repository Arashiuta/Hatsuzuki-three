import * as THREE from "three";
import type { PerspectiveCameraConfig } from "./types";
import { Base } from "../../base/index";

class PerspectiveCamera {
  base: Base;
  camera: THREE.PerspectiveCamera;

  constructor(base: Base, config: PerspectiveCameraConfig) {
    this.base = base;
    const { container } = base;
    const {
      fov = 75,
      aspect = container.clientWidth / container.clientHeight,
      near = 0.1,
      far = 200,
      position = [50, 50, 50],
      helper = false,
      autoSet = true,
    } = config;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(...position);

    if (helper) {
      const helper = new THREE.CameraHelper(this.camera);
      this.base.scene.add(helper);
    }
    if (autoSet) {
      this.setCamera();
    }
  }

  setCamera() {
    this.base.camera = this.camera; // 设置Base的相机为PerspectiveCamera
  }

  getCamera() {
    return this.camera; // 返回当前的相机实例
  }

  setOptions(options: Partial<PerspectiveCameraConfig>) {
    const { fov, aspect, near, far, position } = options;
    if (fov !== undefined) this.camera.fov = fov;
    if (aspect !== undefined) this.camera.aspect = aspect;
    if (near !== undefined) this.camera.near = near;
    if (far !== undefined) this.camera.far = far;
    if (position !== undefined) {
      this.camera.position.set(...position);
    }
    this.camera.updateProjectionMatrix(); //更新相机的内部投影矩阵，否则修改不会生效。
  }
}

export { PerspectiveCamera };

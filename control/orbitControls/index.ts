import { OrbitControls as OrbitControlsThree } from "three/addons/controls/OrbitControls.js";
import type { Base } from "../../base";
import type { OrbitControlsConfig } from "./types";

class OrbitControls {
  controls: OrbitControlsThree;
  base: Base;
  constructor(base: Base, config?: OrbitControlsConfig) {
    this.base = base;
    const {
      autoRotate = false,
      autoRotateSpeed = 2.0,
      enableDamping = false,
      dampingFactor = 0.05,
      enableZoom = true,
      minDistance = 0,
      maxDistance = Infinity,
      enableRotate = true,
      maxPolarAngle = Math.PI,
      minPolarAngle = 0,
      maxAzimuthAngle = Infinity,
      minAzimuthAngle = -Infinity,
      enablePan = true,
    } = config || {};

    this.controls = new OrbitControlsThree(
      base.camera,
      base.renderer.domElement
    );
    this.controls.autoRotate = autoRotate;
    this.controls.autoRotateSpeed = autoRotateSpeed;
    this.controls.enableDamping = enableDamping;
    this.controls.dampingFactor = dampingFactor;
    this.controls.enableZoom = enableZoom;
    this.controls.minDistance = minDistance;
    this.controls.maxDistance = maxDistance;
    this.controls.enableRotate = enableRotate;
    this.controls.maxPolarAngle = maxPolarAngle;
    this.controls.minPolarAngle = minPolarAngle;
    this.controls.maxAzimuthAngle = maxAzimuthAngle;
    this.controls.minAzimuthAngle = minAzimuthAngle;
    this.controls.enablePan = enablePan;

    base.animateFuncObj.set("orbitControls", () => {
      this.controls.update();
    });
  }

  saveState() {
    // 保存当前控制器状态,可以使用reset()方法重置到这个状态
    this.controls.saveState();
  }

  reset() {
    // 重置控制器到初始状态
    this.controls.reset();
  }
}

export { OrbitControls };

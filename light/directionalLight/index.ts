import * as THREE from "three";
import type { Base } from "../../base";
import type { DirectionalLightConfig } from "./types";

class DirectionalLight {
  base: Base;
  light: THREE.DirectionalLight;
  constructor(base: Base, config?: DirectionalLightConfig) {
    this.base = base;
    const {
      color = "#ffffff",
      intensity = 0.5,
      castShadow = this.base.autoShadow,
      shadow = {
        resolution: 512,
        //投影范围
        near: 0.1,
        far: 500,
        left: -50,
        right: 50,
        top: 50,
        bottom: -50,
      },
      position = [0, 100, 0],
      target = [0, 0, 0],
      helper = false,
      helperSize = 5,
    } = config || {};

    this.light = new THREE.DirectionalLight(color, intensity);
    this.light.castShadow = castShadow;
    if (castShadow) {
      this.light.castShadow = castShadow;
      this.light.shadow.mapSize.width = shadow.resolution ?? 512;
      this.light.shadow.mapSize.height = shadow.resolution ?? 512;
      this.light.shadow.camera.near = shadow.near ?? 0.1;
      this.light.shadow.camera.far = shadow.far ?? 500;
      this.light.shadow.camera.left = shadow.left ?? -50;
      this.light.shadow.camera.right = shadow.right ?? 50;
      this.light.shadow.camera.top = shadow.top ?? 50;
      this.light.shadow.camera.bottom = shadow.bottom ?? -50;
    }
    this.light.position.set(...position);

    if (target) {
      this.light.target.position.set(...target);
      this.base.scene.add(this.light.target);
    }
    this.base.scene.add(this.light);

    if (helper) {
      const helper = new THREE.DirectionalLightHelper(this.light, helperSize);
      const shadowCameraHelper = new THREE.CameraHelper(
        this.light.shadow.camera
      );
      this.base.scene.add(helper);
      this.base.scene.add(shadowCameraHelper);
    }
  }

  getLight() {
    return this.light;
  }

  setConfig(config: DirectionalLightConfig) {
    const { color, intensity, castShadow, shadow, position, target } = config;
    if (color) this.light.color.set(color);
    if (intensity) this.light.intensity = intensity;
    if (shadow) {
      if (shadow.resolution) {
        this.light.shadow.mapSize.width = shadow.resolution;
        this.light.shadow.mapSize.height = shadow.resolution;
      }
      if (shadow.near) this.light.shadow.camera.near = shadow.near;
      if (shadow.far) this.light.shadow.camera.far = shadow.far;
      if (shadow.left) this.light.shadow.camera.left = shadow.left;
      if (shadow.right) this.light.shadow.camera.right = shadow.right;
      if (shadow.top) this.light.shadow.camera.top = shadow.top;
      if (shadow.bottom) this.light.shadow.camera.bottom = shadow.bottom;
    }
    if (castShadow) {
      this.light.castShadow = castShadow;
    }
    if (position) this.light.position.set(...position);
    if (target) {
      this.light.target.position.set(...target);
      if (this.light.target) {
        this.base.scene.remove(this.light.target);
      }
      this.base.scene.add(this.light.target);
    }
  }

  dispose() {
    this.base.scene.remove(this.light);
    if (this.light.target) {
      this.base.scene.remove(this.light.target);
    }
  }
}

export { DirectionalLight };

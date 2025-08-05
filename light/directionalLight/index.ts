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
      castShadow = false,
      position = [0, 100, 0],
      target,
    } = config || {};

    this.light = new THREE.DirectionalLight(color, intensity);
    this.light.castShadow = castShadow;
    this.light.position.set(...position);
    if (target) {
      this.light.target.position.set(...target);
      this.base.scene.add(this.light.target);
    }
    this.base.scene.add(this.light);
  }

  getLight() {
    return this.light;
  }

  setConfig(config: DirectionalLightConfig) {
    const { color, intensity, castShadow, position, target } = config;
    if (color !== undefined) this.light.color.set(color);
    if (intensity !== undefined) this.light.intensity = intensity;
    if (castShadow !== undefined) this.light.castShadow = castShadow;
    if (position !== undefined) this.light.position.set(...position);
    if (target !== undefined) {
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

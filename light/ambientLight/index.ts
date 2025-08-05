import * as THREE from "three";
import type { Base } from "../../base";
import type { AmbientLightConfig } from "./types";

class AmbientLight {
  light: THREE.AmbientLight;
  constructor(base: Base, config?: AmbientLightConfig) {
    const { color = "#ffffff", intensity = 1 } = config || {};
    const colorThree =
      typeof color === "string" ? new THREE.Color(color) : color;
    this.light = new THREE.AmbientLight(colorThree, intensity); // 柔和的白光
    base.scene.add(this.light);
  }

  setConfig(config: AmbientLightConfig) {
    const { color, intensity } = config;
    if (color) {
      this.light.color.set(
        typeof color === "string" ? new THREE.Color(color) : color
      );
    }
    if (intensity) {
      this.light.intensity = intensity;
    }
  }
}

export { AmbientLight };

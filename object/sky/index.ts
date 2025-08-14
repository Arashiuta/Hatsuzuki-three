import { MathUtils } from "three";
import type { Base } from "../../base";
import type { SkyConfig } from "./types";
import { Sky as SkyThree } from "three/addons/objects/Sky.js";

class Sky {
  base: Base;
  sky: SkyThree;

  constructor(base: Base, config?: SkyConfig) {
    this.base = base;
    const {
      scalar = 4500,
      carPosition,
      sphPosition = [1, 60, 200],
      up = [0, 1, 0],
      turbidity = 12,
      rayleigh = 1,
      mieCoefficient = 0.02,
      mieDirectionalG = 0.99996,
    } = config || {};

    const sky = new SkyThree();
    this.sky = sky;

    this.setConfig({
      scalar,
      carPosition,
      sphPosition,
      up,
      turbidity,
      rayleigh,
      mieCoefficient,
      mieDirectionalG,
    });

    this.base.scene.add(sky);
  }

  setConfig(config: SkyConfig) {
    const {
      scalar,
      carPosition,
      sphPosition,
      up,
      turbidity,
      rayleigh,
      mieCoefficient,
      mieDirectionalG,
    } = config;
    if (scalar) {
      this.sky.scale.setScalar(scalar);
    }
    if (carPosition) {
      this.sky.material.uniforms["sunPosition"].value.set(...carPosition);
    }
    if (sphPosition) {
      let sphPositionFinal = [
        sphPosition[0],
        MathUtils.degToRad(sphPosition[1]),
        MathUtils.degToRad(sphPosition[2]),
      ];
      this.sky.material.uniforms["sunPosition"].value.setFromSphericalCoords(
        ...sphPositionFinal
      );
    }
    if (up) {
      this.sky.material.uniforms["up"].value.set(...up);
    }
    if (turbidity) {
      this.sky.material.uniforms["turbidity"].value = turbidity;
    }
    if (rayleigh) {
      this.sky.material.uniforms["rayleigh"].value = rayleigh;
    }
    if (mieCoefficient) {
      this.sky.material.uniforms["mieCoefficient"].value = mieCoefficient;
    }
    if (mieDirectionalG) {
      this.sky.material.uniforms["mieDirectionalG"].value = mieDirectionalG;
    }
  }

  getSky() {
    return this.sky;
  }
}

export { Sky };

import * as THREE from "three";
import type { Base } from "../../base";
import type { RaycasterConfig } from "./types";

class Raycaster {
  base: Base;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;

  constructor(base: Base, config: RaycasterConfig) {
    this.base = base;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
  }

  normalization(e: MouseEvent) {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  render() {}
}

export { Raycaster };

import * as THREE from "three";
import type { BoxConfig } from "./types";
import type { Base } from "../../base";

class Box {
  base: Base;
  model: THREE.Mesh | null = null;
  constructor(base: Base, config?: BoxConfig) {
    this.base = base;
    const {
      body = [1, 1, 1],
      segment = [1, 1, 1],
      material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      position = [0, 0, 0],
      name = "",
      autoShadow = this.base.autoShadow,
      visible = true,
    } = config || {};
    const geometry = new THREE.BoxGeometry(...body, ...segment);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (autoShadow) {
      mesh.castShadow = true; // 投射阴影
      mesh.receiveShadow = true; // 接收阴影
    }
    if (name) mesh.name = name;
    mesh.visible = visible;
    this.model = mesh;
    this.base.scene.add(mesh);
  }

  getModel() {
    return this.model;
  }
}

export { Box };

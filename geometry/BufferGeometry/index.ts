import * as THREE from "three";
import type { BufferGeometryConfig } from "./types";
import type { Base } from "../../base";

class BufferGeometry {
  base: Base;
  mesh: THREE.Mesh;

  constructor(base: Base, config: BufferGeometryConfig) {
    this.base = base;
    const {
      vertices,
      material,
      position = [0, 0, 0],
      rotate,
      rotation,
      scale,
      name,
    } = config;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    this.mesh = new THREE.Mesh(
      geometry,
      material || new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    this.mesh.position.set(...position);
    if (rotate) this.mesh.rotation.set(...rotate);
    if (rotation) this.mesh.rotation.set(...rotation);
    if (scale) this.mesh.scale.set(...scale);

    this.mesh.name = name || ""; // 设置网格名称
    base.scene.add(this.mesh); // 将网格添加到场景中
  }

  getMesh() {
    return this.mesh;
  }

  setOptions(config: BufferGeometryConfig) {
    const { position, rotate, rotation, scale } = config;
    if (position) this.mesh.position.set(...position);
    if (rotate) this.mesh.rotation.set(...rotate);
    if (rotation) this.mesh.rotation.set(...rotation);
    if (scale) this.mesh.scale.set(...scale);
  }
}

export { BufferGeometry };

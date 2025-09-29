import type { Base } from "../../base";
import * as THREE from "three";
import type { SpriteConfig } from "./types";

class Sprite {
  base: Base;
  model: THREE.Object3D;

  constructor(base: Base, config: SpriteConfig) {
    this.base = base;

    const {
      position,
      material = new THREE.SpriteMaterial({ color: "#ffffff" }),
      scale = [1, 1, 1],
      center = [0.5, 0.5],
      name = "",
    } = config || {};

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(scale[0], scale[1], scale[2]);
    sprite.position.set(position[0], position[1], position[2]);
    sprite.center.set(center[0], center[1]);
    sprite.name = name;
    this.model = sprite;

    this.base.scene.add(sprite);
  }

  getObject() {
    return this.model;
  }
}

export { Sprite };

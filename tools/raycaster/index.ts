import * as THREE from "three";
import type { Base } from "../../base";
import type { RaycasterConfig } from "./types";

class Raycaster {
  base: Base;
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  private config: RaycasterConfig;
  private intersects: THREE.Intersection<THREE.Object3D>[];
  private shouldUpdateIntersects;

  constructor(base: Base, config?: RaycasterConfig) {
    this.base = base;
    const {
      near = 0.1,
      far = Infinity,
      camera = this.base.camera,
      object,
      objects = this.base.scene.children,
    } = config || {};

    this.config = {
      near,
      far,
      camera,
      object,
      objects,
    };

    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = near;
    this.raycaster.far = far;
    this.pointer = new THREE.Vector2();
    this.intersects = [];
    this.shouldUpdateIntersects = true;

    this.start();
  }

  start = () => {
    window.addEventListener("pointermove", this.normalization);
    this.base.addAnimateFunc("raycaster", this.render);
  };

  dispose = () => {
    window.removeEventListener("pointermove", this.normalization);
    this.base.removeAnimateFunc("raycaster");
  };

  getIntersects = () => {
    return this.intersects;
  };

  private normalization = (e: MouseEvent) => {
    const newX = (e.clientX / window.innerWidth) * 2 - 1;
    const newY = -(e.clientY / window.innerHeight) * 2 + 1;
    if (newX !== this.pointer.x || newY !== this.pointer.y) {
      this.pointer.x = newX;
      this.pointer.y = newY;
      this.shouldUpdateIntersects = true;
    }
  };

  private render = () => {
    if (!this.shouldUpdateIntersects) return; // 如果没有变化，直接返回
    this.raycaster.setFromCamera(
      this.pointer,
      this.config.camera ?? this.base.camera
    );
    if (this.config.object) {
      this.intersects = this.raycaster.intersectObject(
        this.config.object,
        true
      );
    } else if (this.config.objects) {
      this.intersects = this.raycaster.intersectObjects(
        this.config.objects,
        true
      );
    } else {
      this.intersects = [];
    }
  };
}

export { Raycaster };

import type { Base } from "../../base";
import * as THREE from "three";
import type { LineConfig } from "./types";

class Line {
  base: Base;
  line: THREE.Line;

  constructor(base: Base, config: LineConfig) {
    this.base = base;
    const {
      points,
      material = new THREE.LineBasicMaterial({ color: "#00FF00" }),
      loop = false,
      name = "",
    } = config || {};

    const linePoints: Array<THREE.Vector3> = [];
    points.forEach((i: Array<number>) => {
      linePoints.push(new THREE.Vector3(...i));
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    this.line = loop
      ? new THREE.LineLoop(geometry, material)
      : new THREE.Line(geometry, material);
    this.line.name = name;

    this.base.scene.add(this.line);
  }

  getObject() {
    return this.line;
  }
}

export { Line };

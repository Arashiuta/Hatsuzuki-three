import * as THREE from "three";
export interface CSS3DObjectConfig {
  place: THREE.Object3D;
  position: [number, number, number];
  name?: string;
  visible?: boolean;
}

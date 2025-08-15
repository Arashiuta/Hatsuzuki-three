import * as THREE from "three";
export interface RaycasterConfig {
  far?: number;
  near?: number;
  camera?: THREE.Camera;
  object?: THREE.Object3D;
  objects?: Array<THREE.Object3D>;
}

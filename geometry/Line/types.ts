import * as THREE from "three";

export interface LineConfig {
  points: Array<[number, number, number]>;
  material?: THREE.Material;
  loop?: boolean;
  name?: string;
}

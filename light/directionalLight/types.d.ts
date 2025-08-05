import * as THREE from "three";
export declare interface DirectionalLightConfig {
  color?: string | THREE.Color;
  intensity?: number;
  castShadow?: boolean;
  position?: [number, number, number];
  target?: [number, number, number];
}

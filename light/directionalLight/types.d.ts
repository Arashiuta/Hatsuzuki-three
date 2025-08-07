import * as THREE from "three";
export declare interface DirectionalLightConfig {
  color?: string | THREE.Color;
  intensity?: number;
  castShadow?: boolean;
  shadow?: {
    resolution?: number; //分辨率，通常为2^n,比如512、1024
    //投影范围
    near?: number;
    far?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  position?: [number, number, number];
  target?: [number, number, number];
  helper?: boolean;
  helperSize?: number;
}

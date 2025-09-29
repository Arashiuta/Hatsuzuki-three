import * as THREE from "three";
export interface SpriteConfig {
  position: [number, number, number];
  material?: THREE.SpriteMaterial;
  scale?: [number, number, number];
  center?: [number, number]; //锚点
  name?: string;
}

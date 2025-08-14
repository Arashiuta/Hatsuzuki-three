import * as THREE from "three";
export interface AmbientLightConfig {
  color?: string | THREE.Color; // 环境光颜色
  intensity?: number; // 环境光强度
}

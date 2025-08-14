import * as THREE from "three";
export interface BaseConfig {
  container?: HTMLElement | string; // 容器元素或选择器
  autoShadow?: boolean; //启用阴影
  resize?: boolean; // 是否自动调整大小
}

export interface SceneOption {
  background?: string | THREE.Color | THREE.Texture;
}

import * as THREE from "three";
export declare interface BaseConfig {
  container?: HTMLElement | string; // 容器元素或选择器
  enableShadow?: boolean; //启用阴影
  resize?: boolean; // 是否自动调整大小
}

export declare interface SceneOption {
  background?: string | THREE.Color | THREE.Texture;
}

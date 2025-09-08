import * as THREE from "three";
export interface BaseConfig {
  container?: HTMLElement | string; // 容器元素或选择器
  autoShadow?: boolean; //启用阴影
  resize?: boolean; // 是否自动调整大小
  antialias?: "MSAA" | "SMAA" | "FXAA"; //抗锯齿  WebGLRenderer 自带的（MSAA）	 后处理的（SMAA/FXAA）
}

export interface SceneOption {
  background?: string | THREE.Color | THREE.Texture;
}

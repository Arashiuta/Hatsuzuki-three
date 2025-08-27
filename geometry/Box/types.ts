import * as THREE from "three";

export interface BoxConfig {
  body: [number, number, number]; //宽高深
  segment?: [number, number, number]; //分段
  material?: THREE.Material; //材质
  position?: [number, number, number]; //位置
  autoShadow?: boolean; //是否投射和接收阴影
  name?: string; //名称
  visible?: boolean; //是否可见
}

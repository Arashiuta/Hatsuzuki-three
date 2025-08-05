export declare interface BufferGeometryConfig {
  vertices: number[]; // 顶点数组
  material?: THREE.Material; // 材质
  position?: [number, number, number]; // 初始位置
  rotate?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number]; // 缩放
  name?: string; // 几何体名称
}

export declare interface OrbitControlsConfig {
  autoRotate?: boolean; // 是否自动旋转
  autoRotateSpeed?: number; // 自动旋转速度
  enableDamping?: boolean; // 是否启用阻尼
  dampingFactor?: number; // 阻尼系数
  enableZoom?: boolean; // 是否启用缩放
  minDistance?: number; // 最小距离
  maxDistance?: number; // 最大距离
  enableRotate?: boolean; // 是否启用旋转
  maxPolarAngle?: number; // 最大垂直角度 范围是0到Math.PI，其默认值为Math.PI。
  minPolarAngle?: number; // 最小垂直角度 范围是0到Math.PI，其默认值为0。
  maxAzimuthAngle?: number; // 最大水平角度 范围是负无穷到正无穷，其默认值为正无穷。
  minAzimuthAngle?: number; // 最小水平角度 范围是负无穷到正无穷，其默认值为负无穷。
  enablePan?: boolean; // 是否启用平移
}

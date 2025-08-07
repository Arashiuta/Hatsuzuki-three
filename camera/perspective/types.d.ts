export declare interface PerspectiveCameraConfig {
  fov?: number; // 视野角度
  aspect?: number; // 宽高比
  near?: number; // 最近可见距离
  far?: number; // 最远可见距离
  position?: [number, number, number]; // 相机位置
  helper?: boolean; // 相机辅助工具
  autoSet?: boolean; // 是否自动设置相机
}

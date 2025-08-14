export interface SkyConfig {
  scalar?: number; //缩放比例
  carPosition?: [number, number, number]; //太阳的位置(笛卡尔坐标) (x, y, z)
  sphPosition?: [number, number, number]; //太阳的位置(球坐标) (半径radius, 极角phi角度 , 方位角theta角度 )
  up?: [number, number, number]; //天空朝向
  turbidity?: number; //浑浊度 1-20
  rayleigh?: number; //瑞利散射 0-10
  mieCoefficient?: number; //米氏散射系数 0-0.1
  mieDirectionalG?: number; //米氏散射方向性 0-1
}

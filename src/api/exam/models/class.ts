// 班级
export type Class = {
  id: number; // int
  name: string; // string
  status: ClassStatus; // int
  desc: string; // string
};

// 状态
export enum ClassStatus {
  Disable, // 禁用
  Enable // 正常
}

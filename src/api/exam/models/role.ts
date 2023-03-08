// 角色表
export type Role = {
  id: number; // int
  name: string; // string
  code: string; // string
  seq: number; // int
  status: RoleStatus; // int
  create_time: number; // int
  update_time: number; // int
  memo: string; // string
};

// 状态
export enum RoleStatus {
  Disable,
  Enable
}

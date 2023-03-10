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

// 格式化状态文本
export const formatRoleStatusText = (v: RoleStatus) => {
  switch (v) {
    case RoleStatus.Disable:
      return "禁用";
    case RoleStatus.Enable:
      return "正常";
    default:
      return "异常";
  }
};

// 获取状态标签
export const getRoleStatusTagType = (v: RoleStatus) => {
  switch (v) {
    case RoleStatus.Disable:
      return "danger";
    case RoleStatus.Enable:
      return "success";
    default:
      return "warning";
  }
};

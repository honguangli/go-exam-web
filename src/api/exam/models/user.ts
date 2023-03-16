// 用户表
export type User = {
  id: number; // int
  name: string; // string
  password: string; // string
  type: UserType; // int
  true_name: string; // string
  mobile: string; // string
  email: string; // string
  status: UserStatus; // int
  create_time: number; // int
  update_time: number; // int
  memo: string; // string
};

// 类型
export enum UserType {
  Admin = 1,
  Teacher = 2,
  Student = 3
}

// 状态
export enum UserStatus {
  Disable,
  Enable
}

// 格式化类型文本
export const formatUserTypeText = (v: UserType) => {
  switch (v) {
    case UserType.Admin:
      return "管理员";
    case UserType.Teacher:
      return "教师";
    case UserType.Student:
      return "学生";
    default:
      return "异常";
  }
};

// 获取类型标签
export const getUserTypeTagType = (v: UserType) => {
  switch (v) {
    case UserType.Admin:
      return "";
    case UserType.Teacher:
      return "success";
    case UserType.Student:
      return "info";
    default:
      return "warning";
  }
};

// 格式化状态文本
export const formatUserStatusText = (v: UserStatus) => {
  switch (v) {
    case UserStatus.Disable:
      return "禁用";
    case UserStatus.Enable:
      return "正常";
    default:
      return "异常";
  }
};

// 获取状态标签
export const getUserStatusTagType = (v: UserStatus) => {
  switch (v) {
    case UserStatus.Disable:
      return "danger";
    case UserStatus.Enable:
      return "success";
    default:
      return "warning";
  }
};

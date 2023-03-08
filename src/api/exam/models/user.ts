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

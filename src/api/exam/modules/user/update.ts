import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { UserType, UserStatus } from "../../models/user";

// 更新用户信息 参数
export interface UpdateUserParam {
  id: number; // int
  name: string; // string
  password: string; // string
  type: UserType; // int
  true_name: string; // string
  mobile: string; // string
  email: string; // string
  status: UserStatus; // int
  memo: string; // string
}

// 更新用户信息 响应
export type UpdateUserResponse = {};

// 更新用户信息
export const UpdateUser = (param: UpdateUserParam) => {
  return http.request<ResponseBody>("post", Api.User.Update, {
    data: genParam(param)
  });
};

import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新用户密码 参数
export interface UpdateUserPasswordParam {
  id: number; // int
  password: string; // string
}

// 更新用户密码 响应
export type UpdateUserPasswordResponse = {};

// 更新用户密码
export const UpdateUserPassword = (param: UpdateUserPasswordParam) => {
  return http.request<ResponseBody>("post", Api.User.UpdatePassword, {
    data: genParam(param)
  });
};

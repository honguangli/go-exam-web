import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新用户信息 参数
export interface UpdateUserUserParam {
  id: number; // int
  role_list: Array<number>; // list<int>
}

// 更新用户信息 响应
export type UpdateUserUserResponse = {};

// 更新用户信息
export const UpdateUserUser = (param: UpdateUserUserParam) => {
  return http.request<ResponseBody>("post", Api.User.UpdateRole, {
    data: genParam(param)
  });
};

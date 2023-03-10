import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { UserType } from "../../models/user";

// 更新用户类型 参数
export interface UpdateUserTypeParam {
  id: number; // int
  type: UserType; // int
}

// 更新用户类型 响应
export type UpdateUserTypeResponse = {};

// 更新用户类型
export const UpdateUserType = (param: UpdateUserTypeParam) => {
  return http.request<ResponseBody>("post", Api.User.UpdateType, {
    data: genParam(param)
  });
};

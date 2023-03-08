import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除用户 参数
export interface DeleteUserParam {
  id?: number;
  list?: Array<number>;
}

// 删除用户 响应
export interface DeleteUserResponse {
  num: number;
}

// 删除用户
export const DeleteUser = (param: DeleteUserParam) => {
  return http.request<ResponseBody>("post", Api.User.Delete, {
    data: genParam(param)
  });
};

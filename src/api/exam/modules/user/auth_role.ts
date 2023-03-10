import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 授权 参数
export interface AuthUserRoleParam {
  id: number; // int
  role_list: Array<number>; // list<int>
}

// 授权 响应
export type AuthUserRoleResponse = {};

// 授权
export const AuthUserRole = (param: AuthUserRoleParam) => {
  return http.request<ResponseBody>("post", Api.User.AuthRole, {
    data: genParam(param)
  });
};

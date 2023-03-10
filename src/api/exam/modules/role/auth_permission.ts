import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新角色权限 参数
export interface AuthRolePermissionParam {
  id: number; // int
  permission_list: Array<number>; // list<int>
}

// 更新角色权限 响应
export type AuthRolePermissionResponse = {};

// 更新角色权限
export const AuthRolePermission = (param: AuthRolePermissionParam) => {
  return http.request<ResponseBody>("post", Api.Role.AuthPermission, {
    data: genParam(param)
  });
};

import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { RolePermissionRel } from "../../models/role_permission_rel";

// 查询角色权限 参数
export interface QueryRolePermissionListParam {
  role_id: number;
}

// 查询角色列表 响应
export interface QueryRolePermissionListResponse {
  list: Array<RolePermissionRel>;
  total: number;
}

// 查询角色列表
export const QueryRolePermissionList = (
  param: QueryRolePermissionListParam
) => {
  return http.request<ResponseBody>("post", Api.Role.QueryPermissionList, {
    data: genParam(param)
  });
};

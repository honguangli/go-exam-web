import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Role } from "../../models/role";

// 查询角色列表 参数
export interface QueryRoleListParam {
  name?: string;
  type?: number;
  limit: number;
  offset: number;
}

// 查询角色列表 响应
export interface QueryRoleListResponse {
  list: Array<Role>;
  total: number;
}

// 查询角色列表
export const QueryRoleList = (param: QueryRoleListParam) => {
  return http.request<ResponseBody>("post", Api.Role.QueryList, {
    data: genParam(param)
  });
};

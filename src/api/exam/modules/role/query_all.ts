import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Role } from "../../models/role";

// 查询角色列表 参数
export type QueryRoleAllParam = {};

// 查询角色列表 响应
export interface QueryRoleAllResponse {
  list: Array<Role>;
  total: number;
}

// 查询角色列表
export const QueryRoleAll = (param: QueryRoleAllParam) => {
  return http.request<ResponseBody>("post", Api.Role.QueryAll, {
    data: genParam(param)
  });
};

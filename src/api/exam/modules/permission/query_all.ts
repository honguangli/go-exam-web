import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Permission } from "../../models/permission";

// 查询权限列表 参数
export type QueryPermissionAllParam = {};

// 查询权限列表 响应
export interface QueryPermissionAllResponse {
  list: Array<Permission>;
  total: number;
}

// 查询权限列表
export const QueryPermissionAll = (param: QueryPermissionAllParam) => {
  return http.request<ResponseBody>("post", Api.Permission.QueryAll, {
    data: genParam(param)
  });
};

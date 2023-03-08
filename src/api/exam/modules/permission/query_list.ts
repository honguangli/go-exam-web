import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Permission } from "../../models/permission";

// 查询权限列表 参数
export interface QueryPermissionListParam {
  name?: string;
  type?: number;
  limit: number;
  offset: number;
}

// 查询权限列表 响应
export interface QueryPermissionListResponse {
  list: Array<Permission>;
  total: number;
}

// 查询权限列表
export const QueryPermissionList = (param: QueryPermissionListParam) => {
  return http.request<ResponseBody>("post", Api.Permission.QueryList, {
    data: genParam(param)
  });
};

import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Permission } from "../../models/permission";

// 查询权限详情 参数
export interface QueryPermissionDetailParam {
  id: number;
}

// 查询权限详情 响应
export interface QueryPermissionDetailResponse {
  detail: Permission;
}

// 查询权限详情
export const QueryPermissionDetail = (param: QueryPermissionDetailParam) => {
  return http.request<ResponseBody>("post", Api.Class.QueryDetail, {
    data: genParam(param)
  });
};

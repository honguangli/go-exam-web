import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Role } from "../../models/role";

// 查询角色详情 参数
export interface QueryRoleDetailParam {
  id: number;
}

// 查询角色详情 响应
export interface QueryRoleDetailResponse {
  detail: Role;
}

// 查询角色详情
export const QueryRoleDetail = (param: QueryRoleDetailParam) => {
  return http.request<ResponseBody>("post", Api.Role.QueryDetail, {
    data: genParam(param)
  });
};

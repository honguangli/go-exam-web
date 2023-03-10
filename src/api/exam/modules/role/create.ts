import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { RoleStatus } from "../../models/role";

// 创建角色 参数
export interface CreateRoleParam {
  name: string; // string
  code: string; // string
  seq: number; // int
  status: RoleStatus; // int
  memo: string; // string
}

// 创建角色 响应
export interface CreateRoleResponse {
  id: number;
}

// 创建角色
export const CreateRole = (param: CreateRoleParam) => {
  return http.request<ResponseBody>("post", Api.Role.Create, {
    data: genParam(param)
  });
};

import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { RoleStatus } from "../../models/role";

// 更新角色信息 参数
export interface UpdateRoleParam {
  id: number; // int
  name: string; // string
  code: string; // string
  seq: number; // int
  status: RoleStatus; // int
  create_time: number; // int
  update_time: number; // int
  memo: string; // string
}

// 更新角色信息 响应
export type UpdateRoleResponse = {};

// 更新角色信息
export const UpdateRole = (param: UpdateRoleParam) => {
  return http.request<ResponseBody>("post", Api.Role.Update, {
    data: genParam(param)
  });
};

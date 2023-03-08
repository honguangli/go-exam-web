import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新角色信息 参数
export interface UpdateRoleUserParam {
  id: number; // int
  permission_list: Array<number>; // list<int>
}

// 更新角色信息 响应
export type UpdateRoleUserResponse = {};

// 更新角色信息
export const UpdateRoleUser = (param: UpdateRoleUserParam) => {
  return http.request<ResponseBody>("post", Api.Role.UpdatePermission, {
    data: genParam(param)
  });
};

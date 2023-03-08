import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除角色 参数
export interface DeleteRoleParam {
  id?: number;
  list?: Array<number>;
}

// 删除角色 响应
export interface DeleteRoleResponse {
  num: number;
}

// 删除角色
export const DeleteRole = (param: DeleteRoleParam) => {
  return http.request<ResponseBody>("post", Api.Role.Delete, {
    data: genParam(param)
  });
};

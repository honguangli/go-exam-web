import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除权限 参数
export interface DeletePermissionParam {
  id?: number;
  list?: Array<number>;
}

// 删除权限 响应
export interface DeletePermissionResponse {
  num: number;
}

// 删除权限
export const DeletePermission = (param: DeletePermissionParam) => {
  return http.request<ResponseBody>("post", Api.Permission.Delete, {
    data: genParam(param)
  });
};

import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建权限 参数
export interface CreatePermissionParam {
  name: string;
  desc: string;
}

// 创建权限 响应
export interface CreatePermissionResponse {
  id: number;
}

// 创建权限
export const CreatePermission = (param: CreatePermissionParam) => {
  return http.request<ResponseBody>("post", Api.Permission.Create, {
    data: genParam(param)
  });
};

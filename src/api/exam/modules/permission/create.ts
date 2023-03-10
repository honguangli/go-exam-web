import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建权限 参数
export interface CreatePermissionParam {
  type: number; // int
  pid: number; // int
  code: string; // string
  status: number; // int
  path: string; // string
  name: string; // string
  component: string; // string
  redirect: string; // string
  meta_title: string; // string
  meta_icon: string; // string
  meta_extra_icon: string; // string
  meta_show_link: number; // int
  meta_show_parent: number; // int
  meta_keep_alive: number; // int
  meta_frame_src: string; // string
  meta_frame_loading: number; // int
  meta_hidden_tag: number; // int
  meta_rank: number; // int
  memo: string; // string
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

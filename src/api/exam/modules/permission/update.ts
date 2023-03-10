import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新权限信息 参数
export interface UpdatePermissionParam {
  id: number; // int
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

// 更新权限信息 响应
export type UpdatePermissionResponse = {};

// 更新权限信息
export const UpdatePermission = (param: UpdatePermissionParam) => {
  return http.request<ResponseBody>("post", Api.Permission.Update, {
    data: genParam(param)
  });
};

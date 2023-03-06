import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除班级 参数
export interface DeleteClassParam {
  ids: Array<number>;
}

// 删除班级 响应
export interface DeleteClassResponse {}

// 删除班级
export const DeleteClass = (param: DeleteClassParam) => {
  return http.request<ResponseBody>("post", Api.Class.Delete, {
    data: genParam(param)
  });
};

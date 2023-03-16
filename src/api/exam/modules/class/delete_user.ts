import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除班级考生 参数
export interface DeleteClassUserParam {
  id?: number;
  list?: Array<number>;
}

// 删除班级考生 响应
export interface DeleteClassUserResponse {
  num: number;
}

// 删除班级考生
export const DeleteClassUser = (param: DeleteClassUserParam) => {
  return http.request<ResponseBody>("post", Api.Class.DeleteUser, {
    data: genParam(param)
  });
};

import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 添加班级考生 参数
export interface PushClassUserParam {
  class_id: number;
  user_list: Array<number>;
}

// 添加班级考生 响应
export interface PushClassUserResponse {
  num: number;
}

// 添加班级考生
export const PushClassUser = (param: PushClassUserParam) => {
  return http.request<ResponseBody>("post", Api.Class.PushUser, {
    data: genParam(param)
  });
};

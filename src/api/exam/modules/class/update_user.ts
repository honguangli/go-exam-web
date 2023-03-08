import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新班级信息 参数
export interface UpdateClassUserParam {
  id: number; // int
  user_list: Array<number>; // list<int>
}

// 更新班级信息 响应
export type UpdateClassUserResponse = {};

// 更新班级信息
export const UpdateClassUser = (param: UpdateClassUserParam) => {
  return http.request<ResponseBody>("post", Api.Class.UpdateUser, {
    data: genParam(param)
  });
};

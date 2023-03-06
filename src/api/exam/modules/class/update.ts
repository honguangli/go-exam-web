import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { ClassStatus } from "../../models/class";

// 更新班级信息 参数
export interface UpdateClassParam {
  name: string; // string
  status: ClassStatus; // int
  desc: string; // string
}

// 更新班级信息 响应
export interface UpdateClassResponse {}

// 更新班级信息
export const UpdateClass = (param: UpdateClassParam) => {
  return http.request<ResponseBody>("post", Api.Class.Update, {
    data: genParam(param)
  });
};

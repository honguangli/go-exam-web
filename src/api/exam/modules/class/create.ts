import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建班级 参数
export interface CreateClassParam {
  name: string;
  desc: string;
}

// 创建班级 响应
export interface CreateClassResponse {
  id: number;
}

// 创建班级
export const CreateClass = (param: CreateClassParam) => {
  return http.request<ResponseBody>("post", Api.Class.Create, {
    data: genParam(param)
  });
};

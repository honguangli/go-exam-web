import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 创建科目 参数
export interface CreateSubjectParam {
  name: string;
  desc: string;
}

// 创建科目 响应
export interface CreateSubjectResponse {
  id: number;
}

// 创建科目
export const CreateSubject = (param: CreateSubjectParam) => {
  return http.request<ResponseBody>("post", Api.Subject.Create, {
    data: genParam(param)
  });
};

import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 更新科目信息 参数
export interface UpdateSubjectParam {
  name: string; // string
  desc: string; // string
}

// 更新科目信息 响应
export interface UpdateSubjectResponse {}

// 更新科目信息
export const UpdateSubject = (param: UpdateSubjectParam) => {
  return http.request<ResponseBody>("post", Api.Subject.Update, {
    data: genParam(param)
  });
};

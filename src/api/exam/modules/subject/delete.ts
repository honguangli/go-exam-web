import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";

// 删除科目 参数
export interface DeleteSubjectParam {
  id?: number;
  list?: Array<number>;
}

// 删除科目 响应
export interface DeleteSubjectResponse {
  num: number;
}

// 删除科目
export const DeleteSubject = (param: DeleteSubjectParam) => {
  return http.request<ResponseBody>("post", Api.Subject.Delete, {
    data: genParam(param)
  });
};

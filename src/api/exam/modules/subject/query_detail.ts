import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Subject } from "../../models/subject";

// 查询科目详情 参数
export interface QuerySubjectDetailParam {
  id: number;
}

// 查询科目详情 响应
export interface QuerySubjectDetailResponse {
  detail: Subject;
}

// 查询科目详情
export const QuerySubjectDetail = (param: QuerySubjectDetailParam) => {
  return http.request<ResponseBody>("post", Api.Subject.QueryDetail, {
    data: genParam(param)
  });
};

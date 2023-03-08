import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Subject } from "../../models/subject";

// 查询科目列表 参数
export interface QuerySubjectListParam {
  name?: string;
  limit: number;
  offset: number;
}

// 查询科目列表 响应
export interface QuerySubjectListResponse {
  list: Array<Subject>;
  total: number;
}

// 查询科目列表
export const QuerySubjectList = (param: QuerySubjectListParam) => {
  return http.request<ResponseBody>("post", Api.Subject.QueryList, {
    data: genParam(param)
  });
};

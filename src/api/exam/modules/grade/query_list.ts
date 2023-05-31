import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Grade } from "../../models/grade";

// 查询成绩列表 参数
export interface QueryGradeListParam {
  plan_id: number;
  limit: number;
  offset: number;
}

// 查询成绩列表 响应
export interface QueryGradeListResponse {
  list: Array<Grade>;
  total: number;
}

// 查询成绩列表
export const QueryGradeList = (param: QueryGradeListParam) => {
  return http.request<ResponseBody>("post", Api.Grade.QueryList, {
    data: genParam(param)
  });
};

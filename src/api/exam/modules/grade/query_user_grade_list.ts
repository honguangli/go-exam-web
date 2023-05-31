import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Grade } from "../../models/grade";

// 查询考生成绩列表 参数
export interface QueryUserGradeListParam {
  user_name: string;
  limit: number;
  offset: number;
}

// 查询考生成绩列表 响应
export interface QueryUserGradeListResponse {
  list: Array<Grade>;
  total: number;
}

// 查询考生成绩列表
export const QueryUserGradeList = (param: QueryUserGradeListParam) => {
  return http.request<ResponseBody>("post", Api.Grade.QueryUesrGradeList, {
    data: genParam(param)
  });
};

import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Grade } from "../../models/grade";

// 查询考生待考列表 参数
export interface QueryUserExamListParam {
  user_name: string;
  limit: number;
  offset: number;
}

// 查询考生待考列表 响应
export interface QueryUserExamListResponse {
  list: Array<Grade>;
  total: number;
}

// 查询考生待考列表
export const QueryUserExamList = (param: QueryUserExamListParam) => {
  return http.request<ResponseBody>("post", Api.Grade.QueryUserExamList, {
    data: genParam(param)
  });
};

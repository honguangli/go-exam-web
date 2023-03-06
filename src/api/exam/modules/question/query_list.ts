import { http } from "@/utils/http";
import Api from "../../api/api";
import { genParam, ResponseBody } from "../../client/client";
import { Question } from "../../models/question";

// 查询试题列表 参数
export interface QueryQuestionListParam {
  name?: string;
  type?: number;
  limit: number;
  offset: number;
}

// 查询试题列表 响应
export interface QueryQuestionListResponse {
  list: Array<Question>;
  total: number;
}

// 查询试题列表
export const QueryQuestionList = (param: QueryQuestionListParam) => {
  return http.request<ResponseBody>("post", Api.Question.QueryList, {
    data: genParam(param)
  });
};
